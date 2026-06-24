export interface MoonPhaseData {
  age: number;
  name: string;
  emoji: string;
  illumination: number;
  description: string;
  influence: string;
  isFavorable: boolean;
}

export interface MoonCalendarDay {
  day: number;
  emoji: string;
  name: string;
  isFavorable: boolean;
  isToday: boolean;
}

const ZODIAC_ELEMENTS: Record<string, string> = {
  Ariete: 'fire', Leone: 'fire', Sagittario: 'fire',
  Toro: 'earth', Vergine: 'earth', Capricorno: 'earth',
  Gemelli: 'air', Bilancia: 'air', Acquario: 'air',
  Cancro: 'water', Scorpione: 'water', Pesci: 'water',
};

function getMoonAge(date: Date): number {
  const ref = new Date('2000-01-06T18:14:00Z');
  const cycle = 29.530589;
  const days = (date.getTime() - ref.getTime()) / 86400000;
  return ((days % cycle) + cycle) % cycle;
}

function phaseInfo(age: number): { name: string; emoji: string; illumination: number } {
  const pct =
    age < 14.77
      ? Math.round((age / 14.77) * 100)
      : Math.round(((29.53 - age) / 14.77) * 100);

  if (age < 1.85)  return { name: 'Nuova Luna',         emoji: '🌑', illumination: pct };
  if (age < 7.38)  return { name: 'Luna Crescente',     emoji: '🌒', illumination: pct };
  if (age < 9.22)  return { name: 'Primo Quarto',       emoji: '🌓', illumination: pct };
  if (age < 14.77) return { name: 'Gibbosa Crescente',  emoji: '🌔', illumination: pct };
  if (age < 16.61) return { name: 'Luna Piena',         emoji: '🌕', illumination: pct };
  if (age < 22.15) return { name: 'Gibbosa Calante',    emoji: '🌖', illumination: pct };
  if (age < 23.99) return { name: 'Ultimo Quarto',      emoji: '🌗', illumination: pct };
  return             { name: 'Luna Calante',             emoji: '🌘', illumination: pct };
}

function isFavorable(age: number, sign: string): boolean {
  const el = ZODIAC_ELEMENTS[sign] || 'fire';
  if (el === 'fire')  return age >= 11 && age <= 18;
  if (el === 'earth') return age < 4 || age > 26;
  if (el === 'air')   return age >= 5 && age <= 11;
  if (el === 'water') return (age >= 13 && age <= 17) || (age >= 21 && age <= 25);
  return false;
}

const DESCRIPTIONS: Record<string, string> = {
  'Nuova Luna':        'Il cielo è silenzioso. Semina nuovi desideri nel buio fertile.',
  'Luna Crescente':    'La luce cresce lentamente. I tuoi progetti prendono slancio.',
  'Primo Quarto':      'Metà del cammino. Le sfide di oggi rafforzano la tua determinazione.',
  'Gibbosa Crescente': 'L\'energia si avvicina al culmine. Porta a termine ciò che hai iniziato.',
  'Luna Piena':        'Il culmine del ciclo lunare. Le emozioni sono intense, la chiarezza è massima.',
  'Gibbosa Calante':   'Tempo di gratitudine. Raccogli i frutti e inizia a rilasciare il superfluo.',
  'Ultimo Quarto':     'Lascia andare ciò che non serve più. Fa\' spazio a ciò che verrà.',
  'Luna Calante':      'Il riposo si avvicina. Introspezione e preparazione per il nuovo ciclo.',
};

export function getCurrentMoon(sign: string): MoonPhaseData {
  const age = getMoonAge(new Date());
  const { name, emoji, illumination } = phaseInfo(age);
  const fav = isFavorable(age, sign);
  return {
    age, name, emoji, illumination,
    description: DESCRIPTIONS[name] ?? '',
    influence: fav
      ? 'La luna favorisce la tua energia oggi. Approfitta di questo momento propizio.'
      : 'La luna invita alla riflessione. Conserva le tue energie per i prossimi giorni.',
    isFavorable: fav,
  };
}

export function getMoonCalendar(
  year: number,
  month: number,
  sign: string,
): MoonCalendarDay[] {
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: MoonCalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12);
    const age = getMoonAge(date);
    const { emoji, name } = phaseInfo(age);
    days.push({
      day,
      emoji,
      name,
      isFavorable: isFavorable(age, sign),
      isToday:
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day,
    });
  }

  return days;
}

export const MONTH_NAMES_IT = [
  'Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre',
];
