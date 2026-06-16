'use client';

import { RARITY_CONFIG } from '@/lib/constants';
import RarityBadge from '@/components/card/RarityBadge';
import SnapCard from '@/components/card/SnapCard';
import type { SnapCard as SnapCardType, Rarity } from '@/lib/types';

// Static demo cards for when DB is empty
const DEMO_CARDS: Array<{
  rarity: Rarity;
  flagA: string; countryA: string;
  flagB: string; countryB: string;
  serial: number;
  photographer: string;
}> = [
  { rarity: 'legendary', flagA: '🇧🇷', countryA: 'BRA', flagB: '🇦🇷', countryB: 'ARG', serial: 1,  photographer: 'Carlos_R' },
  { rarity: 'epic',      flagA: '🇫🇷', countryA: 'FRA', flagB: '🇩🇪', countryB: 'GER', serial: 8,  photographer: 'Ana_M' },
  { rarity: 'rare',      flagA: '🇪🇸', countryA: 'ESP', flagB: '🇵🇹', countryB: 'POR', serial: 17, photographer: 'Tomás_V' },
  { rarity: 'epic',      flagA: '🇺🇸', countryA: 'USA', flagB: '🇲🇽', countryB: 'MEX', serial: 4,  photographer: 'Lu_P' },
  { rarity: 'rare',      flagA: '🇮🇹', countryA: 'ITA', flagB: '🇳🇱', countryB: 'NED', serial: 22, photographer: 'Marco_B' },
  { rarity: 'legendary', flagA: '🇯🇵', countryA: 'JPN', flagB: '🇰🇷', countryB: 'KOR', serial: 3,  photographer: 'Hana_K' },
];

function DemoCard({ demo, size = 'sm' }: {
  demo: typeof DEMO_CARDS[0];
  size?: 'sm' | 'md';
}) {
  const cfg = RARITY_CONFIG[demo.rarity];
  const isLegendary = demo.rarity === 'legendary';
  const isEpic = demo.rarity === 'epic';
  const w = size === 'md' ? 200 : 140;
  const h = size === 'md' ? 280 : 196;

  return (
    <div
      className={`relative select-none flex flex-col overflow-hidden ${isLegendary ? 'animate-legendary' : ''}`}
      style={{
        width: w, height: h,
        borderRadius: 12,
        border: `2px solid ${cfg.color}`,
        boxShadow: `0 0 20px ${cfg.glow}`,
        background: cfg.bgGradient,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Shimmer */}
      {(isLegendary || isEpic) && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: isLegendary
              ? 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.10) 50%, transparent 70%)'
              : 'linear-gradient(135deg, transparent 30%, rgba(168,85,247,0.09) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer-sweep 3s linear infinite',
          }}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ borderBottom: `1px solid ${cfg.color}33` }}
      >
        <span className="text-[10px] font-semibold text-white/70 truncate leading-none">
          {demo.flagA} {demo.countryA}
        </span>
        <span className="text-[8px] font-bold text-white/40 mx-1">vs</span>
        <span className="text-[10px] font-semibold text-white/70 truncate leading-none text-right">
          {demo.countryB} {demo.flagB}
        </span>
      </div>

      {/* Image placeholder — styled pitch gradient with ball */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ background: `${cfg.bgGradient}, rgba(0,0,0,0.2)` }}
      >
        {/* Pitch lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 28px)',
        }} />
        <div className="absolute left-1/2 top-0 bottom-0 w-px opacity-10" style={{ background: 'rgba(255,255,255,0.3)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{ width: 44, height: 44, border: '1px solid rgba(255,255,255,0.4)' }} />
        {/* Ball */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span style={{ fontSize: size === 'md' ? 36 : 28, opacity: 0.85 }}>⚽</span>
          <div
            className="text-[8px] font-black tracking-widest uppercase"
            style={{ color: cfg.color, textShadow: `0 0 8px ${cfg.glow}` }}
          >
            {isLegendary ? 'SNAP' : isEpic ? 'GOL' : 'CARD'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-2 py-1.5 flex items-center justify-between"
        style={{ borderTop: `1px solid ${cfg.color}33`, background: 'rgba(0,0,0,0.4)' }}
      >
        <div className="space-y-0.5">
          <p className="text-[8px] text-white/40 truncate leading-none">{demo.photographer}</p>
          <RarityBadge rarity={demo.rarity} size="sm" />
        </div>
        <span className="text-[9px] font-mono text-white/40">
          #{String(demo.serial).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}

interface Props {
  communityCards: SnapCardType[];
  locale: string;
}

export default function ShowcaseSection({ communityCards, locale }: Props) {
  const hasCommunity = communityCards.length > 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">World Cup 2026</p>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {hasCommunity ? 'Cartas de la comunidad' : 'Muestra de cartas'}
          </h2>
          <p className="text-white/65 text-sm mt-1">
            {hasCommunity
              ? 'Las fotos más recientes subidas por la comunidad'
              : 'Así se ve tu álbum cuando empieces a coleccionar'}

          </p>
        </div>
        <a
          href={`/${locale}/pack`}
          className="text-sg-green text-sm font-semibold hover:text-sg-green/80 transition-colors whitespace-nowrap"
        >
          Abrir sobre →
        </a>
      </div>

      {/* Rarity legend */}
      <div className="flex flex-wrap gap-3">
        {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((r) => {
          const cfg = RARITY_CONFIG[r];
          return (
            <div key={r} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              <span className="text-xs text-white/60">{cfg.label} — {cfg.chance}%</span>
            </div>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {hasCommunity
          ? communityCards.map((card) => (
              <div key={card.id} className="flex justify-center">
                <SnapCard card={card} size="sm" />
              </div>
            ))
          : DEMO_CARDS.map((demo, i) => (
              <div key={i} className="flex justify-center">
                <DemoCard demo={demo} size="sm" />
              </div>
            ))
        }

        {/* CTA slot */}
        <div className="flex justify-center">
          <a
            href={`/${locale}/upload`}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sg-green/30 hover:border-sg-green/60 transition-colors group"
            style={{ width: 140, height: 196 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sg-green text-xl font-bold group-hover:scale-110 transition-transform"
              style={{ background: 'rgba(0,200,83,0.1)' }}
            >
              +
            </div>
            <span className="text-xs text-sg-green/60 text-center px-3 leading-snug group-hover:text-sg-green transition-colors">
              Subir tu foto
            </span>
          </a>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(0,150,36,0.12), rgba(0,200,83,0.06))',
          border: '1px solid rgba(0,200,83,0.15)',
        }}
      >
        <div>
          <p className="font-bold text-white text-base">Completa tu álbum</p>
          <p className="text-white/65 text-sm mt-0.5">220 cartas para coleccionar. Abre un sobre y empieza.</p>
        </div>
        <a
          href={`/${locale}/pack`}
          className="shrink-0 px-6 py-3 rounded-full font-bold text-sg-bg text-sm hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #009624, #00c853)' }}
        >
          Abrir sobre — $1.99
        </a>
      </div>
    </section>
  );
}
