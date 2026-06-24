import type { AuraData, DailyCheckin, Mood } from '@/types';

interface AuraDefinition {
  color: string;
  label: string;
  description: string;
  baseIntensity: number;
}

const MOOD_AURA_MAP: Record<Mood, AuraDefinition> = {
  energico: {
    color: '#f97316',
    label: 'Fiamma Radiante',
    description: "La tua aura brucia con l'energia di una supernova in miniatura. Irradi calore e dinamismo che gli altri percepiscono anche prima che tu entri nella stanza. Una forza cosmica in forma umana.",
    baseIntensity: 90,
  },
  riflessivo: {
    color: '#7c3aed',
    label: 'Nebula Contemplativa',
    description: "La tua aura è densa e profonda come una nebula lontana — piena di strutture complesse invisibili a prima vista. Chi ti conosce superficialmente vede silenzio; chi ti conosce davvero vede un universo intero.",
    baseIntensity: 70,
  },
  romantico: {
    color: '#ec4899',
    label: 'Rosa Cosmica',
    description: "La tua aura emana la frequenza dell'amore cosmico — quella vibrazione rosata che attrae, scalda e connette. Le stelle confermano che il tuo cuore è un magnete per le belle cose.",
    baseIntensity: 85,
  },
  ansioso: {
    color: '#64748b',
    label: 'Vento Inquieto',
    description: "La tua aura si muove veloce e cambia continuamente — come il vento che non riesce a fermarsi. C'è molta energia qui, anche se non sembra pacifica. Tutta questa vibrazione può diventare forza se canalizzata.",
    baseIntensity: 60,
  },
  curioso: {
    color: '#06b6d4',
    label: 'Luce Esploratrice',
    description: "La tua aura è brillante e mobile come la luce che esplora angoli bui con entusiasmo genuino. Irradi una vibrazione di apertura mentale che attrae informazioni, opportunità e persone interessanti.",
    baseIntensity: 80,
  },
  malinconico: {
    color: '#312e81',
    label: 'Luna Profonda',
    description: "La tua aura ha la profondità e la bellezza misteriosa della luna nel cielo notturno. La malinconia non è assenza di luce — è luce che viaggia da molto lontano, con tutto il significato che porta con sé.",
    baseIntensity: 65,
  },
};

const MIXED_AURA: AuraDefinition = {
  color: '#f59e0b',
  label: 'Aurora Multiforme',
  description: "La tua aura non si lascia definire da un singolo stato — è un'aurora boreale di emozioni e energie che si mescolano in modo unico. Questa complessità è un segno di ricchezza interiore, non di disordine.",
  baseIntensity: 75,
};

/**
 * Calculates the dominant aura from an array of moods.
 */
export function calculateAuraFromMoods(moods: Mood[]): AuraData {
  if (!moods || moods.length === 0) {
    return {
      color: MIXED_AURA.color,
      intensity: MIXED_AURA.baseIntensity,
      label: MIXED_AURA.label,
      description: MIXED_AURA.description,
    };
  }

  // Count mood frequencies
  const counts: Record<string, number> = {};
  for (const mood of moods) {
    counts[mood] = (counts[mood] || 0) + 1;
  }

  // Find dominant mood
  let dominantMood: Mood | null = null;
  let maxCount = 0;
  for (const [mood, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood as Mood;
    }
  }

  // Check if dominant mood is clearly dominant (>40% of entries)
  const dominanceRatio = maxCount / moods.length;

  if (dominanceRatio < 0.4 || !dominantMood) {
    // Mixed aura
    return {
      color: MIXED_AURA.color,
      intensity: MIXED_AURA.baseIntensity,
      label: MIXED_AURA.label,
      description: MIXED_AURA.description,
    };
  }

  const auraDef = MOOD_AURA_MAP[dominantMood];
  // Intensity scales with dominance ratio
  const intensity = Math.round(auraDef.baseIntensity * (0.7 + dominanceRatio * 0.3));

  return {
    color: auraDef.color,
    intensity: Math.min(100, intensity),
    label: auraDef.label,
    description: auraDef.description,
  };
}

/**
 * Returns an array of AuraData for each checkin in the list.
 */
export function getAuraHistory(checkins: DailyCheckin[]): AuraData[] {
  return checkins.map((checkin) => {
    const auraDef = MOOD_AURA_MAP[checkin.mood as Mood] || MOOD_AURA_MAP['riflessivo'];
    return {
      color: auraDef.color,
      intensity: auraDef.baseIntensity,
      label: auraDef.label,
      description: auraDef.description,
    };
  });
}
