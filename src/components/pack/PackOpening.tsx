'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import SnapCard from '@/components/card/SnapCard';
import type { SnapCard as SnapCardType } from '@/lib/types';

const RARITY_COLORS: Record<string, string> = {
  common: '#94a3b8', rare: '#3b82f6', epic: '#a855f7', legendary: '#ffd700',
};

interface Tier {
  id: string;
  name: string;
  price: string;
  cards: number;
  desc: string;
  tag: string | null;
  gradient: string;
  border: string;
  glow: string;
  odds: Record<string, number>;
}

interface Props {
  tiers: Tier[];
  onOpen: (packType?: string) => Promise<SnapCardType[]>;
  locale: string;
}

type Phase = 'select' | 'opening' | 'revealing' | 'done';

export default function PackOpening({ tiers, onOpen, locale }: Props) {
  const t = useTranslations('Pack');
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedTier, setSelectedTier] = useState<Tier>(tiers[1]); // default: standard
  const [cards, setCards] = useState<SnapCardType[]>([]);
  const [revealed, setRevealed] = useState<number>(0);

  async function handleOpen() {
    setPhase('opening');
    const result = await onOpen(selectedTier.id);
    setCards(result);
    setPhase('revealing');
    for (let i = 1; i <= result.length; i++) {
      await new Promise((r) => setTimeout(r, 420));
      setRevealed(i);
    }
    setPhase('done');
  }

  // ── Tier selection ──────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="space-y-8">
        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {tiers.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className="relative flex flex-col rounded-2xl overflow-hidden text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  border: `2px solid ${isSelected ? tier.border : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isSelected ? `0 0 32px ${tier.glow}` : 'none',
                  outline: isSelected ? `2px solid ${tier.border}` : 'none',
                  outlineOffset: 2,
                }}
              >
                {tier.tag && (
                  <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                    style={{ background: tier.id === 'premium' ? '#a855f7' : '#00c853', color: '#06080f' }}>
                    {tier.tag}
                  </div>
                )}

                {/* Pack visual */}
                <div className="flex flex-col items-center justify-center gap-3 py-10 px-4"
                  style={{ background: tier.gradient }}>
                  <div className="text-5xl opacity-80">⚽</div>
                  <span className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: tier.id === 'standard' ? '#00c853' : tier.id === 'premium' ? '#a855f7' : '#94a3b8' }}>
                    SnapGol
                  </span>
                  <span className="text-white/50 text-xs">{tier.cards} cartas</span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3 bg-sg-surface flex-1">
                  <div>
                    <p className="font-black text-white text-base">{tier.name}</p>
                    <p className="text-white/55 text-xs mt-0.5">{tier.desc}</p>
                  </div>

                  {/* Odds mini bars */}
                  <div className="space-y-1.5">
                    {Object.entries(tier.odds).map(([rarity, pct]) => (
                      <div key={rarity} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RARITY_COLORS[rarity] }} />
                        <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: RARITY_COLORS[rarity] }} />
                        </div>
                        <span className="text-[10px] text-white/45 w-6 text-right">{pct}%</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xl font-black text-white pt-1">{tier.price}</p>
                </div>

                {/* Selected check */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-sg-green flex items-center justify-center text-sg-bg text-[10px] font-black">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Open button */}
        <div className="text-center space-y-3">
          <button
            onClick={handleOpen}
            className="px-10 py-4 rounded-full font-black text-sg-bg text-base transition-all hover:opacity-90 hover:shadow-xl hover:shadow-sg-green/25"
            style={{ background: 'linear-gradient(135deg, #009624, #00c853)' }}
          >
            Abrir {selectedTier.name} — {selectedTier.price}
          </button>
          <p className="text-white/40 text-xs">
            {selectedTier.cards} cartas aleatorias · probabilidades mostradas arriba
          </p>
        </div>
      </div>
    );
  }

  // ── Opening spinner ─────────────────────────────────────────
  if (phase === 'opening') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20">
        <div className="w-12 h-12 rounded-full border-2 border-sg-green border-t-transparent animate-spin" />
        <p className="text-white/60 text-sm font-medium">Mezclando las cartas…</p>
      </div>
    );
  }

  // ── Reveal + done ───────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-10">
      {/* Cards fan */}
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={i < revealed ? 'animate-card-reveal' : 'opacity-0'}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <SnapCard card={card} size="md" />
          </div>
        ))}
      </div>

      {phase === 'done' && (
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push(`/${locale}/album`)}
            className="px-6 py-3 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors"
          >
            Ver mi álbum →
          </button>
          <button
            onClick={() => { setPhase('select'); setCards([]); setRevealed(0); }}
            className="px-6 py-3 rounded-full border border-white/10 text-white/70 font-semibold text-sm hover:border-white/20 hover:text-white transition-colors"
          >
            Abrir otro sobre
          </button>
        </div>
      )}
    </div>
  );
}
