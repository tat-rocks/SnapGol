'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SnapCard from '@/components/card/SnapCard';
import { RARITY_CONFIG } from '@/lib/constants';
import type { Rarity, SnapCard as SnapCardType } from '@/lib/types';
import { buyCard } from '@/lib/supabase/actions';

const RARITIES: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

interface Props {
  listings: SnapCardType[];
  locale: string;
}

export default function MarketplaceClient({ listings, locale }: Props) {
  const t = useTranslations('Marketplace');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [buying, setBuying] = useState<string | null>(null);

  async function handleBuy(card: SnapCardType) {
    const listingId = (card as any).listing_id;
    if (!listingId) return;
    setBuying(card.id);
    try {
      await buyCard(listingId);
    } finally {
      setBuying(null);
    }
  }

  const filtered = listings
    .filter((c) => rarityFilter === 'all' || c.rarity === rarityFilter)
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price_usd - b.price_usd;
      if (sort === 'price_desc') return b.price_usd - a.price_usd;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setRarityFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              rarityFilter === 'all'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t('filter_all')}
          </button>
          {RARITIES.map((r) => {
            const cfg = RARITY_CONFIG[r];
            const active = rarityFilter === r;
            return (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  color: active ? '#06080f' : cfg.color,
                  backgroundColor: active ? cfg.color : `${cfg.color}22`,
                  border: `1px solid ${cfg.color}44`,
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-sg-surface border border-white/10 text-white/60 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-sg-green/40"
          >
            <option value="newest">{t('sort_newest')}</option>
            <option value="price_asc">{t('sort_price_asc')}</option>
            <option value="price_desc">{t('sort_price_desc')}</option>
          </select>
        </div>
      </div>

      {/* Cards grid */}
      {listings.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="text-5xl">🏪</p>
          <p className="text-white/60 font-semibold text-lg">No listings yet</p>
          <p className="text-white/30 text-sm max-w-xs mx-auto">
            Be the first to list a card. Upload your photo and put it up for sale.
          </p>
          <a
            href={`/${locale}/upload`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors"
          >
            Upload a Photo →
          </a>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">{t('no_results')}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((card) => (
            <div key={card.id} className="flex flex-col items-center gap-3">
              <SnapCard card={card} size="sm" />
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{t('listed_by')} {card.photographer_name}</span>
                  {card.is_minted && (
                    <span className="text-[9px] text-sg-green border border-sg-green/30 rounded-full px-1.5 py-0.5">NFT</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">${card.price_usd.toFixed(2)}</span>
                  <button
                    onClick={() => handleBuy(card)}
                    disabled={buying === card.id}
                    className="px-3 py-1 rounded-full text-xs font-bold text-sg-bg bg-sg-green hover:bg-sg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {buying === card.id ? '...' : t('buy_now')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
