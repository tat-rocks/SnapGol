'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RARITY_CONFIG } from '@/lib/constants';
import type { SnapCard as SnapCardType } from '@/lib/types';
import RarityBadge from './RarityBadge';

interface Props {
  card: SnapCardType;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (card: SnapCardType) => void;
  className?: string;
}

const dimensions = {
  sm:  { w: 140, h: 196 },
  md:  { w: 200, h: 280 },
  lg:  { w: 260, h: 364 },
};

export default function SnapCard({ card, size = 'md', onClick, className = '' }: Props) {
  const [hovered, setHovered] = useState(false);
  const cfg = RARITY_CONFIG[card.rarity];
  const { w, h } = dimensions[size];

  const isLegendary = card.rarity === 'legendary';
  const isEpic      = card.rarity === 'epic';

  return (
    <div
      className={`relative cursor-pointer select-none transition-all duration-300 ${className} ${
        isLegendary ? 'animate-legendary' : ''
      }`}
      style={{
        width: w,
        height: h,
        borderRadius: 12,
        border: `2px solid ${hovered ? cfg.color : cfg.color + '99'}`,
        boxShadow: hovered
          ? `0 0 24px ${cfg.glow}, 0 0 48px ${cfg.glow}55`
          : `0 0 12px ${cfg.glow}55`,
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        background: cfg.bgGradient,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.(card)}
    >
      {/* Holographic shimmer overlay */}
      {(isLegendary || isEpic) && (
        <div
          className="absolute inset-0 z-10 rounded-xl pointer-events-none"
          style={{
            background: isLegendary
              ? 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)'
              : 'linear-gradient(135deg, transparent 30%, rgba(168,85,247,0.08) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer-sweep 3s linear infinite',
          }}
        />
      )}

      {/* Match header */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ borderBottom: `1px solid ${cfg.color}33` }}
      >
        <span className="text-[10px] font-semibold text-white/60 truncate leading-none">
          {card.flag_a} {card.country_a}
        </span>
        <span className="text-[8px] font-bold text-white/40 mx-1">vs</span>
        <span className="text-[10px] font-semibold text-white/60 truncate leading-none text-right">
          {card.country_b} {card.flag_b}
        </span>
      </div>

      {/* Photo area */}
      <div
        className="relative overflow-hidden"
        style={{ height: h - 76 }}
      >
        {card.photo_url ? (
          <Image
            src={card.photo_url}
            alt={card.match_label}
            fill
            className="object-cover"
            sizes={`${w}px`}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: cfg.bgGradient }}
          >
            <span className="text-4xl opacity-30">⚽</span>
          </div>
        )}
      </div>

      {/* Bottom strip */}
      <div
        className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
        style={{
          background: `linear-gradient(to top, ${cfg.bgGradient.split(',')[0].replace('linear-gradient(135deg, ', '')}dd, transparent)`,
          borderTop: `1px solid ${cfg.color}33`,
        }}
      >
        <p className="text-[9px] text-white/50 truncate leading-none mb-0.5">
          {card.photographer_name}
        </p>
        <div className="flex items-center justify-between">
          <RarityBadge rarity={card.rarity} size="sm" />
          {card.serial_number && (
            <span className="text-[9px] font-mono text-white/40">
              #{String(card.serial_number).padStart(3, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
