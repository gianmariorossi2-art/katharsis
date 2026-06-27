import type { DailyReading, NatalChart, UserProfile } from '@/types';

export interface DailyReadingResponse {
  reading: DailyReading;
  natal_chart: NatalChart | null;
  birth_lat: number | null;
  birth_lon: number | null;
  source: string;
}

export async function fetchDailyReading(profile: UserProfile): Promise<DailyReadingResponse> {
  const today = new Date().toISOString().split('T')[0];

  const resp = await fetch('/api/daily-reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: profile.name,
      date: today,
      zodiac_sign: profile.zodiac_sign,
      birth_date: profile.birth_date ?? null,
      birth_time: profile.birth_time ?? null,
      birth_place: profile.birth_place ?? null,
      birth_lat: profile.birth_lat ?? null,
      birth_lon: profile.birth_lon ?? null,
    }),
  });

  if (!resp.ok) throw new Error('Errore nella generazione della lettura');
  return resp.json() as Promise<DailyReadingResponse>;
}
