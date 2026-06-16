'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteCard } from '@/lib/supabase/actions';
import SnapCard from '@/components/card/SnapCard';
import type { SnapCard as SnapCardType } from '@/lib/types';

interface Props {
  cards: SnapCardType[];
  totalSlots: number;
  locale: string;
}

export default function AlbumGrid({ cards, totalSlots, locale }: Props) {
  const t = useTranslations('Album');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(cardId: string) {
    if (!confirm('¿Eliminar esta carta de tu álbum?')) return;
    setDeleting(cardId);
    try {
      await deleteCard(cardId);
    } finally {
      setDeleting(null);
    }
  }

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
        <div className="text-center py-12 space-y-4">
          <p className="text-white/40">{t('no_cards')}</p>
          <a href={`/${locale}/pack`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors">
            Abrir primer sobre
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="flex justify-center relative group">
              <SnapCard card={card} size="sm" />
              <button
                onClick={() => handleDelete(card.id)}
                disabled={deleting === card.id}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white/60 text-xs
                           opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white
                           transition-all flex items-center justify-center z-20 disabled:opacity-50"
                title="Eliminar carta"
              >
                {deleting === card.id ? '…' : '✕'}
              </button>
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
