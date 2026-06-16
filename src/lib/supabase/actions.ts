'use server';

import Groq from 'groq-sdk';
import { createClient } from './server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import type { Rarity, SnapCard } from '@/lib/types';

async function validateSoccerPhoto(file: File): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { ok: true };

  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mediaType = file.type || 'image/jpeg';

    const client = new Groq({ apiKey });
    const msg = await client.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } },
          {
            type: 'text',
            text: 'Is this photo related to soccer / football (players, stadium, match, ball, referee, fans at a game, pitch, goal)? Reply only: YES or NO, then one short reason.',
          },
        ],
      }],
    });

    const text = (msg.choices[0]?.message?.content ?? '').trim().toUpperCase();
    if (text.startsWith('NO')) {
      const reason = text.replace(/^NO[.,:\s-]*/i, '').trim() || 'La foto no parece ser del Mundial.';
      return { ok: false, reason: `Solo fotos del Mundial. ${reason}` };
    }
    return { ok: true };
  } catch {
    return { ok: true }; // fail open if AI is down
  }
}

async function siteUrl() {
  const h = await headers();
  const host  = h.get('host') ?? 'snap-gol.vercel.app';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

// ─── Auth ─────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const supabase = await createClient();
  const base = await siteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${base}/auth/callback`,
    },
  });
  if (error) throw error;
  if (data.url) redirect(data.url);
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  redirect('/en');
}

export async function signInWithMagicLink(email: string) {
  const supabase = await createClient();
  const base = await siteUrl();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${base}/auth/callback`,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/en');
}

// ─── Cards ────────────────────────────────────────────────────

export async function uploadCard(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const file    = formData.get('photo') as File;
  const matchId = formData.get('match_id') as string;
  const caption = formData.get('caption') as string;

  // 0. AI validation — check photo is soccer-related
  const validation = await validateSoccerPhoto(file);
  if (!validation.ok) throw new Error(validation.reason);

  // 1. Upload photo to Storage
  const ext      = file.name.split('.').pop();
  const filePath = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('card-photos')
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('card-photos')
    .getPublicUrl(filePath);

  // 2. Insert card record
  const { data: card, error: insertError } = await supabase
    .from('cards')
    .insert({
      photographer_id: user.id,
      match_id:        matchId || null,
      photo_url:       publicUrl,
      caption:         caption || null,
      rarity:          'common',
      price_usd:       0.99,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  // 3. Add to user's collection
  await supabase.from('collections').insert({
    user_id: user.id,
    card_id: card.id,
    quantity: 1,
  });

  revalidatePath('/[locale]/album', 'page');
  return card;
}

export async function likeCard(cardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  await supabase.from('card_likes').insert({ user_id: user.id, card_id: cardId });
  revalidatePath('/[locale]/marketplace', 'page');
}

export async function unlikeCard(cardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  await supabase.from('card_likes')
    .delete()
    .match({ user_id: user.id, card_id: cardId });
  revalidatePath('/[locale]/marketplace', 'page');
}

// ─── Packs ────────────────────────────────────────────────────

export async function openPack(packType: string = 'standard'): Promise<SnapCard[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch pool of existing cards (up to 50 most recent)
  const { data: poolRows } = await supabase
    .from('cards')
    .select(`
      id, photo_url, rarity, likes,
      serial_number, total_supply, price_usd, is_for_sale, is_minted, created_at,
      profiles!cards_photographer_id_fkey (username),
      matches (team_a, team_b, flag_a, flag_b)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  // Get seeded matches for demo fallback cards
  const { data: matchRows } = await supabase
    .from('matches')
    .select('id, team_a, team_b, flag_a, flag_b')
    .limit(10);

  const pool = poolRows ?? [];
  const demoMatches = matchRows ?? [];

  const PACK_ODDS: Record<string, { legendary: number; epic: number; rare: number }> = {
    mini:     { legendary: 0,  epic: 5,  rare: 25 },
    standard: { legendary: 3,  epic: 12, rare: 25 },
    premium:  { legendary: 5,  epic: 20, rare: 30 },
  };
  const odds = PACK_ODDS[packType] ?? PACK_ODDS.standard;

  function drawRarity(): Rarity {
    const n = Math.random() * 100;
    if (n < odds.legendary) return 'legendary';
    if (n < odds.legendary + odds.epic) return 'epic';
    if (n < odds.legendary + odds.epic + odds.rare) return 'rare';
    return 'common';
  }

  const DEMO_PRICES: Record<Rarity, number> = {
    legendary: 49.99, epic: 12.50, rare: 4.99, common: 0.99,
  };

  function makeDemoCard(rarity: Rarity, index: number): SnapCard {
    const m = demoMatches[index % Math.max(demoMatches.length, 1)];
    return {
      id: `demo-${index}-${Date.now()}`,
      photo_url: '',
      photographer_name: 'SnapGol',
      photographer_id: '',
      match_id: m?.id ?? '',
      match_label: m ? `${m.team_a} vs ${m.team_b}` : 'World Cup 2026',
      country_a: m?.team_a ?? '',
      country_b: m?.team_b ?? '',
      flag_a: m?.flag_a ?? '⚽',
      flag_b: m?.flag_b ?? '🏆',
      rarity,
      price_usd: DEMO_PRICES[rarity],
      likes: 0,
      is_for_sale: false,
      is_minted: false,
      created_at: new Date().toISOString(),
    };
  }

  const packSize = ({ mini: 3, standard: 5, premium: 10 } as Record<string, number>)[packType] ?? 5;
  const results: SnapCard[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < packSize; i++) {
    const rarity = drawRarity();
    const candidates = pool.filter(
      (c) => c.rarity === rarity && !usedIds.has(c.id)
    );

    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      usedIds.add(pick.id);
      const m = pick.matches as unknown as { team_a: string; team_b: string; flag_a: string; flag_b: string } | null;
      results.push({
        id: pick.id,
        photo_url: pick.photo_url,
        photographer_name: (pick.profiles as unknown as { username: string } | null)?.username ?? 'unknown',
        photographer_id: '',
        match_id: '',
        match_label: m ? `${m.team_a} vs ${m.team_b}` : '',
        country_a: m?.team_a ?? '',
        country_b: m?.team_b ?? '',
        flag_a: m?.flag_a ?? '',
        flag_b: m?.flag_b ?? '',
        rarity: pick.rarity as Rarity,
        price_usd: pick.price_usd,
        likes: pick.likes,
        is_for_sale: pick.is_for_sale,
        is_minted: pick.is_minted,
        serial_number: pick.serial_number,
        total_supply: pick.total_supply,
        created_at: pick.created_at,
      });
    } else {
      results.push(makeDemoCard(rarity, i));
    }
  }

  // Add real cards to user's collection
  const realCards = results.filter((c) => !c.id.startsWith('demo-'));
  if (realCards.length > 0) {
    await supabase.from('collections').upsert(
      realCards.map((c) => ({ user_id: user.id, card_id: c.id, quantity: 1 })),
      { onConflict: 'user_id,card_id' }
    );
  }

  // Record the pack opening
  const packPrice = ({ mini: 0.99, standard: 1.99, premium: 4.99 } as Record<string, number>)[packType] ?? 1.99;
  await supabase.from('packs').insert({ user_id: user.id, price_paid: packPrice });

  revalidatePath('/[locale]/album', 'page');
  return results;
}

export async function deleteCard(cardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Remove from user's collection
  await supabase.from('collections')
    .delete()
    .match({ user_id: user.id, card_id: cardId });

  // If this user is also the photographer, delete the card and its storage file
  const { data: card } = await supabase
    .from('cards')
    .select('photo_url, photographer_id')
    .eq('id', cardId)
    .single();

  if (card && card.photographer_id === user.id) {
    // Extract storage path from public URL
    const url = card.photo_url as string;
    const storagePrefix = '/storage/v1/object/public/card-photos/';
    const idx = url.indexOf(storagePrefix);
    if (idx !== -1) {
      const filePath = url.slice(idx + storagePrefix.length);
      await supabase.storage.from('card-photos').remove([filePath]);
    }
    await supabase.from('cards').delete().eq('id', cardId);
  }

  revalidatePath('/[locale]/album', 'page');
}

// ─── Marketplace ──────────────────────────────────────────────

export async function buyCard(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: listing } = await supabase
    .from('listings')
    .select('*, cards(*)')
    .eq('id', listingId)
    .eq('status', 'active')
    .single();

  if (!listing) throw new Error('Listing not found');

  // Mark as sold
  await supabase.from('listings').update({
    status: 'sold',
    buyer_id: user.id,
    sold_at: new Date().toISOString(),
  }).eq('id', listingId);

  // Transfer card to buyer's collection
  await supabase.from('collections').upsert({
    user_id: user.id,
    card_id: listing.card_id,
    quantity: 1,
  }, { onConflict: 'user_id,card_id' });

  revalidatePath('/[locale]/album', 'page');
  revalidatePath('/[locale]/marketplace', 'page');
}
