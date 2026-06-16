import { RARITY_CONFIG } from '@/lib/constants';
import type { Rarity } from '@/lib/types';

interface Props {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-3 py-1',
};

export default function RarityBadge({ rarity, size = 'md' }: Props) {
  const cfg = RARITY_CONFIG[rarity];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-widest ${sizes[size]}`}
      style={{
        color: cfg.color,
        backgroundColor: `${cfg.color}22`,
        border: `1px solid ${cfg.color}66`,
      }}
    >
      {rarity === 'legendary' && <span>★</span>}
      {cfg.label}
    </span>
  );
}
