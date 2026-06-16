'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SnapCard from '@/components/card/SnapCard';
import RarityBadge from '@/components/card/RarityBadge';
import { RARITY_CONFIG } from '@/lib/constants';
import type { Rarity, SnapCard as SnapCardType } from '@/lib/types';

const RARITIES: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

// Placeholder mock listings
const MOCK_LISTINGS: SnapCardType[] = [
  {
    id: '1', photo_url: '', photographer_name: 'Carlos M.', photographer_id: '1',
    match_id: 'm1', match_label: 'Brazil vs Argentina', country_a: 'Brazil', country_b: 'Argentina',
    flag_a: '🇧🇷', flag_b: '🇦🇷', rarity: 'legendary', price_usd: 49.99,
    likes: 8420, is_for_sale: true, is_minted: false, serial_number: 1, total_supply: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: '2', photo_url: '', photographer_name: 'Ana S.', photographer_id: '2',
    match_id: 'm2', match_label: 'France vs Spain', country_a: 'France', country_b: 'Spain',
    flag_a: '🇫🇷', flag_b: '🇪🇸', rarity: 'epic', price_usd: 12.50,
    likes: 3210, is_for_sale: true, is_minted: false, serial_number: 7, total_supply: 50,
    created_at: new Date().toISOString(),
  },
  {
    id: '3', photo_url: '', photographer_name: 'João P.', photographer_id: '3',
    match_id: 'm3', match_label: 'Germany vs Portugal', country_a: 'Germany', country_b: 'Portugal',
    flag_a: '🇩🇪', flag_b: '🇵🇹', rarity: 'rare', price_usd: 4.99,
    likes: 980, is_for_sale: true, is_minted: false, serial_number: 23, total_supply: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: '4', photo_url: '', photographer_name: 'Sofia R.', photographer_id: '4',
    match_id: 'm4', match_label: 'Morocco vs Senegal', country_a: 'Morocco', country_b: 'Senegal',
    flag_a: '🇲🇦', flag_b: '🇸🇳', rarity: 'common', price_usd: 0.99,
    likes: 210, is_for_sale: true, is_minted: false, serial_number: 88, total_supply: 500,
    created_at: new Date().toISOString(),
  },
  {
    id: '5', photo_url: '', photographer_name: 'Mehmet A.', photographer_id: '5',
    match_id: 'm5', match_label: 'Argentina vs France', country_a: 'Argentina', country_b: 'France',
    flag_a: '🇦🇷', flag_b: '🇫🇷', rarity: 'legendary', price_usd: 89.00,
    likes: 14200, is_for_sale: true, is_minted: true, serial_number: 1, total_supply: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '6', photo_url: '', photographer_name: 'Lina V.', photographer_id: '6',
    match_id: 'm6', match_label: 'Japan vs Croatia', country_a: 'Japan', country_b: 'Croatia',
    flag_a: '🇯🇵', flag_b: '🇭🇷', rarity: 'epic', price_usd: 18.00,
    likes: 4100, is_for_sale: true, is_minted: false, serial_number: 12, total_supply: 50,
    created_at: new Date().toISOString(),
  },
];

export default function MarketplaceClient() {
  const t = useTranslations('Marketplace');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const filtered = MOCK_LISTINGS
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
      {filtered.length === 0 ? (
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
                    className="px-3 py-1 rounded-full text-xs font-bold text-sg-bg bg-sg-green hover:bg-sg-green/90 transition-colors"
                  >
                    {t('buy_now')}
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
