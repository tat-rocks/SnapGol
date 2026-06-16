export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Stage = 'groups' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'final';

export interface SnapCard {
  id: string;
  photo_url: string;
  thumbnail_url?: string;
  photographer_name: string;
  photographer_id: string;
  photographer_avatar?: string;
  match_id: string;
  match_label: string;
  country_a: string;
  country_b: string;
  flag_a: string;
  flag_b: string;
  rarity: Rarity;
  price_usd: number;
  likes: number;
  is_for_sale: boolean;
  is_minted: boolean;
  serial_number?: number;
  total_supply?: number;
  created_at: string;
}

export interface Match {
  id: string;
  team_a: string;
  team_b: string;
  flag_a: string;
  flag_b: string;
  date: string;
  stage: Stage;
  score_a?: number;
  score_b?: number;
  venue?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  country?: string;
  album_progress: number;
  total_cards: number;
}

export interface PackResult {
  cards: SnapCard[];
  opened_at: string;
}
