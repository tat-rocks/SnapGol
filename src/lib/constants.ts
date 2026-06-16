import type { Rarity } from './types';

export const RARITY_CONFIG: Record<Rarity, {
  label: string;
  color: string;
  glow: string;
  bgGradient: string;
  chance: number;
}> = {
  common: {
    label: 'Common',
    color: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.4)',
    bgGradient: 'linear-gradient(135deg, #1e293b, #334155)',
    chance: 60,
  },
  rare: {
    label: 'Rare',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.5)',
    bgGradient: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
    chance: 25,
  },
  epic: {
    label: 'Epic',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'linear-gradient(135deg, #3b0764, #7e22ce)',
    chance: 12,
  },
  legendary: {
    label: 'Legendary',
    color: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.7)',
    bgGradient: 'linear-gradient(135deg, #78350f, #d97706)',
    chance: 3,
  },
};

export const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  ar: 'العربية',
};

export const ALBUM_TOTAL_SLOTS = 220;

export const MOCK_STATS = {
  cards: 142_830,
  collectors: 28_410,
  trades: 61_200,
  countries: 32,
};
