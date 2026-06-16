'use server';

import { createClient } from './server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// ─── Auth ─────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) throw error;
  if (data.url) redirect(data.url);
}

export async function signInWithMagicLink(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
