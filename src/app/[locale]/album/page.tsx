import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import AlbumGrid from '@/components/album/AlbumGrid';
import { ALBUM_TOTAL_SLOTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import type { SnapCard } from '@/lib/types';

type Props = { params: Promise<{ locale: string }> };

export default async function AlbumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Album');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let cards: SnapCard[] = [];

  if (user) {
    const { data } = await supabase
      .from('collections')
      .select(`
        quantity,
        cards (
          id, photo_url, thumbnail_url, rarity, likes,
          serial_number, total_supply, price_usd, is_for_sale, is_minted, created_at,
          profiles!cards_photographer_id_fkey (username),
          matches (team_a, team_b, flag_a, flag_b)
        )
      `)
      .eq('user_id', user.id);

    cards = (data ?? []).map((row: any) => ({
      id:                row.cards.id,
      photo_url:         row.cards.photo_url,
      thumbnail_url:     row.cards.thumbnail_url,
      photographer_name: row.cards.profiles?.username ?? 'unknown',
      photographer_id:   user.id,
      match_id:          '',
      match_label:       row.cards.matches
                           ? `${row.cards.matches.team_a} vs ${row.cards.matches.team_b}`
                           : '',
      country_a:         row.cards.matches?.team_a ?? '',
      country_b:         row.cards.matches?.team_b ?? '',
      flag_a:            row.cards.matches?.flag_a ?? '',
      flag_b:            row.cards.matches?.flag_b ?? '',
      rarity:            row.cards.rarity,
      price_usd:         row.cards.price_usd,
      likes:             row.cards.likes,
      is_for_sale:       row.cards.is_for_sale,
      is_minted:         row.cards.is_minted,
      serial_number:     row.cards.serial_number,
      total_supply:      row.cards.total_supply,
      created_at:        row.cards.created_at,
    }));
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{t('title')}</h1>
              <p className="text-white/40 text-sm mt-1">
                {t('progress', { collected: cards.length, total: ALBUM_TOTAL_SLOTS })}
              </p>
            </div>
            <a href="../upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors">
              + Upload Photo
            </a>
          </div>

          {!user ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-4xl">🔒</p>
              <p className="text-white font-semibold">Sign in to see your album</p>
              <p className="text-white/40 text-sm">Create an account to start collecting cards.</p>
            </div>
          ) : (
            <AlbumGrid cards={cards} totalSlots={ALBUM_TOTAL_SLOTS} />
          )}
        </div>
      </main>
    </>
  );
}
