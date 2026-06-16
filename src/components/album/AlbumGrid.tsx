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
  const isComplete = cards.length >= totalSlots;

  // Album completion celebration
  if (isComplete) {
    return (
      <div className="relative rounded-3xl overflow-hidden py-16 px-8 text-center space-y-6 animate-legendary"
        style={{
          background: 'linear-gradient(135deg, #78350f, #d97706)',
          border: '2px solid #ffd700',
          boxShadow: '0 0 60px rgba(255,215,0,0.4)',
        }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.10) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer-sweep 3s linear infinite',
          }} />
        <div className="relative z-10 space-y-4">
          <div className="text-7xl">🏆</div>
          <h2 className="text-3xl font-black text-white" style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
            ¡Álbum Completo!
          </h2>
          <p className="text-amber-200 text-base max-w-md mx-auto">
            Coleccionaste las {totalSlots} cartas del Mundial 2026. Eres un campeón.
          </p>
          <div className="inline-block px-4 py-2 rounded-2xl border-2 border-yellow-400"
            style={{ background: 'rgba(255,215,0,0.15)' }}>
            <p className="text-yellow-300 text-xs uppercase tracking-widest font-black">Legendario · Álbum Completo 2026</p>
          </div>
          <div className="flex gap-3 justify-center flex-wrap pt-2">
            <a href={`/${locale}/marketplace`}
              className="px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#ffd700', color: '#06080f' }}>
              Ver marketplace →
            </a>
            <a href={`/${locale}/upload`}
              className="px-6 py-3 rounded-full border-2 border-yellow-400 text-yellow-300 font-semibold text-sm hover:bg-yellow-400/10 transition-colors">
              Subir más fotos
            </a>
          </div>
        </div>
      </div>
    );
  }

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
