'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import SnapCard from '@/components/card/SnapCard';
import type { SnapCard as SnapCardType } from '@/lib/types';

interface Props {
  onOpen: () => Promise<SnapCardType[]>;
}

type Phase = 'idle' | 'opening' | 'revealing' | 'done';

export default function PackOpening({ onOpen }: Props) {
  const t = useTranslations('Pack');
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [phase, setPhase] = useState<Phase>('idle');
  const [cards, setCards] = useState<SnapCardType[]>([]);
  const [revealed, setRevealed] = useState<number>(0);

  async function handleOpen() {
    setPhase('opening');
    const result = await onOpen();
    setCards(result);
    setPhase('revealing');
    // Reveal cards one by one
    for (let i = 1; i <= result.length; i++) {
      await new Promise((r) => setTimeout(r, 450));
      setRevealed(i);
    }
    setPhase('done');
  }

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center gap-6">
        {/* Pack visual */}
        <button
          onClick={handleOpen}
          className="group relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
          aria-label={t('click_to_open')}
        >
          <div className="w-48 h-72 rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
              border: '2px solid rgba(0,200,83,0.4)',
              boxShadow: '0 0 40px rgba(0,200,83,0.2)',
            }}
          >
            <div className="absolute inset-0 card-holographic" />
            <span className="text-6xl relative z-10">⚽</span>
            <span className="text-sm font-bold text-sg-green relative z-10 tracking-widest uppercase">SnapGol</span>
            <span className="text-xs text-white/40 relative z-10">5 cards</span>
          </div>
        </button>
        <p className="text-white/40 text-sm">{t('click_to_open')}</p>
      </div>
    );
  }

  if (phase === 'opening') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="w-10 h-10 rounded-full border-2 border-sg-green border-t-transparent animate-spin" />
        <p className="text-white/60 text-sm">{t('revealing')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={i < revealed ? 'animate-card-reveal' : 'opacity-0'}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <SnapCard card={card} size="md" />
          </div>
        ))}
      </div>

      {phase === 'done' && (
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push(`/${locale}/album`)}
            className="px-5 py-2 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors"
          >
            {t('done')}
          </button>
          <button
            onClick={() => { setPhase('idle'); setCards([]); setRevealed(0); }}
            className="px-5 py-2 rounded-full border border-white/10 text-white/60 font-bold text-sm hover:border-white/20 hover:text-white transition-colors"
          >
            {t('open_another')}
          </button>
        </div>
      )}
    </div>
  );
}
