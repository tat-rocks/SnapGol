'use client';

import { useTranslations } from 'next-intl';
import SnapCard from '@/components/card/SnapCard';
import type { SnapCard as SnapCardType } from '@/lib/types';

interface Props {
  cards: SnapCardType[];
  totalSlots: number;
}

export default function AlbumGrid({ cards, totalSlots }: Props) {
  const t = useTranslations('Album');

  const progress = Math.round((cards.length / totalSlots) * 100);
  const emptySlots = Math.max(0, totalSlots - cards.length);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">{t('progress', { collected: cards.length, total: totalSlots })}</span>
          <span className="font-bold text-sg-green">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #009624, #00c853)',
            }}
          />
        </div>
      </div>

      {/* Card grid */}
      {cards.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-4xl">📦</p>
          <p className="text-white/40">{t('no_cards')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="flex justify-center">
              <SnapCard card={card} size="sm" />
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.min(emptySlots, 24) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex justify-center"
            >
              <div
                className="rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1"
                style={{ width: 140, height: 196 }}
              >
                <span className="text-3xl opacity-20">⚽</span>
                <span className="text-[10px] text-white/20">{t('empty_slot')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
