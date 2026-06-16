'use client';

import { useState } from 'react';
import RarityBadge from '@/components/card/RarityBadge';
import { RARITY_CONFIG } from '@/lib/constants';
import type { Rarity } from '@/lib/types';

function Card({ rarity, style }: { rarity: Rarity; style: React.CSSProperties }) {
  const cfg = RARITY_CONFIG[rarity];
  const isLegendary = rarity === 'legendary';

  return (
    <div
      className="absolute"
      style={{
        width: 160,
        height: 224,
        borderRadius: 12,
        background: cfg.bgGradient,
        border: `2px solid ${cfg.color}`,
        boxShadow: `0 0 ${isLegendary ? 30 : 20}px ${cfg.glow}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
        ...style,
      }}
    >
      {isLegendary && (
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer-sweep 3s linear infinite',
          }} />
      )}
      <div className="px-2 py-1.5 text-[10px] text-white/50 border-b border-white/10 flex justify-between">
        <span>🇧🇷 BRA</span><span>🇦🇷 ARG</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-5xl opacity-30">⚽</span>
      </div>
      <div className="px-2 py-1.5 border-t border-white/10 flex items-center justify-between">
        <RarityBadge rarity={rarity} size="sm" />
        <span className="text-[9px] font-mono text-white/30">#042</span>
      </div>
    </div>
  );
}

export default function HeroCards() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hidden lg:block relative w-full"
      style={{ height: 440 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Back — Epic */}
      <Card
        rarity="epic"
        style={{
          top: hovered ? '28%' : '18%',
          left: hovered ? '-4%' : '2%',
          zIndex: 1,
          rotate: hovered ? '-14deg' : '-8deg',
          animation: hovered ? 'none' : 'float-back 6s ease-in-out infinite',
        }}
      />

      {/* Middle — Rare */}
      <Card
        rarity="rare"
        style={{
          top: hovered ? '35%' : '22%',
          left: hovered ? '22%' : '22%',
          zIndex: 2,
          rotate: hovered ? '0deg' : '2deg',
          animation: hovered ? 'none' : 'float 4s ease-in-out infinite',
        }}
      />

      {/* Front — Legendary */}
      <Card
        rarity="legendary"
        style={{
          top: hovered ? '10%' : '8%',
          left: hovered ? '52%' : '46%',
          zIndex: 3,
          rotate: hovered ? '12deg' : '6deg',
          animation: hovered ? 'none' : 'float-mid 5s ease-in-out infinite',
          boxShadow: `0 0 ${hovered ? 50 : 30}px rgba(255,215,0,${hovered ? 0.8 : 0.5}), 0 0 80px rgba(255,215,0,${hovered ? 0.3 : 0.15})`,
        }}
      />
    </div>
  );
}
