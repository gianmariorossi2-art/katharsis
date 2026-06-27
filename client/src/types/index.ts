export type ZodiacSign =
  | 'Ariete'
  | 'Toro'
  | 'Gemelli'
  | 'Cancro'
  | 'Leone'
  | 'Vergine'
  | 'Bilancia'
  | 'Scorpione'
  | 'Sagittario'
  | 'Capricorno'
  | 'Acquario'
  | 'Pesci';

export type Mood =
  | 'energico'
  | 'riflessivo'
  | 'romantico'
  | 'ansioso'
  | 'curioso'
  | 'malinconico';

export interface UserProfile {
  id: string;
  name: string;
  zodiac_sign: ZodiacSign;
  level: number;
  xp: number;
  gems: number;
  current_streak: number;
  record_streak: number;
  subscription_status: 'free' | 'premium';
  language?: string;
  created_at: string;
  birth_date?: string | null;
  birth_time?: string | null;
  birth_place?: string | null;
  onboarding_complete?: boolean;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  mood: Mood;
  horoscope_text: string;
  opened: boolean;
  created_at: string;
}

export interface OracleMessage {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: string;
}

export interface AuraData {
  color: string;
  intensity: number; // 0-100
  label: string;
  description: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  color: string;
}
