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

export interface PlanetPosition {
  sign: string;
  casa: number;
  degrees: string;
}

export interface NatalChart {
  calculated_at: string;
  sole: PlanetPosition;
  luna: PlanetPosition;
  mercurio: PlanetPosition;
  venere: PlanetPosition;
  marte: PlanetPosition;
  giove: PlanetPosition;
  saturno: PlanetPosition;
  urano: PlanetPosition;
  nettuno: PlanetPosition;
  plutone: PlanetPosition;
  ascendente: { sign: string; degrees: string };
  medio_cielo: { sign: string; degrees: string };
  nodo_nord: PlanetPosition;
  chirone: PlanetPosition;
  elemento_dominante: string;
  pianeta_dominante: string;
  configurazione_principale: string | null;
  sistema_case: 'Placidus';
}

export interface DailyReading {
  date: string;
  generated_at: string;
  nome_utente: string;
  transito_principale: {
    pianeta_transitante: string;
    aspetto: string;
    punto_natale: string;
    orbe: string;
    casa_coinvolta: number;
  };
  oroscopo_giorno: string;
  arcano_maggiore: {
    numero: string;
    nome: string;
    significato_oggi: string;
  };
  arcano_minore: {
    seme: string;
    numero: string;
    nome: string;
    significato_oggi: string;
  };
  mantra_giorno: string;
  focus_aree: string[];
  energia_giorno: 'espansiva' | 'contratta' | 'neutrale' | 'creativa';
  colore_giorno: string;
  nota_tecnica?: string;
  gemini_prompt: string;
  image_url?: string | null;
}

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
  birth_lat?: number | null;
  birth_lon?: number | null;
  natal_chart?: NatalChart | null;
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
  intensity: number;
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
