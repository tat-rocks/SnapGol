import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import MarketplaceClient from './MarketplaceClient';
import { createClient } from '@/lib/supabase/server';
import type { SnapCard } from '@/lib/types';

type Props = { params: Promise<{ locale: string }> };

export default async function MarketplacePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Marketplace');

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from('listings')
    .select(`
      id,
      price_usd,
      cards (
        id, photo_url, rarity, likes,
        serial_number, total_supply, is_for_sale, is_minted, created_at,
        profiles!cards_photographer_id_fkey (username),
        matches (team_a, team_b, flag_a, flag_b)
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(48);

  const listings: SnapCard[] = (rows ?? []).map((row: any) => {
    const c = row.cards;
    const m = c?.matches;
    return {
      id:                c?.id ?? row.id,
      photo_url:         c?.photo_url ?? '',
      photographer_name: c?.profiles?.username ?? 'unknown',
      photographer_id:   '',
      match_id:          '',
      match_label:       m ? `${m.team_a} vs ${m.team_b}` : '',
      country_a:         m?.team_a ?? '',
      country_b:         m?.team_b ?? '',
      flag_a:            m?.flag_a ?? '',
      flag_b:            m?.flag_b ?? '',
      rarity:            c?.rarity ?? 'common',
      price_usd:         row.price_usd ?? c?.price_usd ?? 0.99,
      likes:             c?.likes ?? 0,
      is_for_sale:       true,
      is_minted:         c?.is_minted ?? false,
      serial_number:     c?.serial_number,
      total_supply:      c?.total_supply,
      created_at:        c?.created_at ?? new Date().toISOString(),
      listing_id:        row.id,
    } as SnapCard & { listing_id: string };
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">{t('title')}</h1>
            <p className="text-white/40 text-sm mt-1">{t('subtitle')}</p>
          </div>
          <MarketplaceClient listings={listings} locale={locale} />
        </div>
      </main>
    </>
  );
}
