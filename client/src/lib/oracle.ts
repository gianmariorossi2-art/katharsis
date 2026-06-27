const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface OracleContext {
  question: string;
  zodiacSign: string;
  domain: string;
  userTier: 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS';
  language: string;
  returnUser: boolean;
  prevTheme: string | null;
  sessionCount: number;
  birthDate?: string | null;
  birthTime?: string | null;
  birthPlace?: string | null;
}

export async function getOracleResponse(ctx: OracleContext): Promise<string> {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome';

  try {
    const res = await fetch(`${API_BASE}/api/oracle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ctx, date, time, timezone }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = (await res.json()) as { response: string };
    return data.response;
  } catch {
    return localFallback();
  }
}

const OFFLINE = [
  "Le stelle mi raggiungono con difficoltà in questo momento. Poni di nuovo la tua domanda tra poco — l'universo ascolterà.",
  "Il canale cosmico è temporaneamente disturbato. Riprova tra qualche istante.",
  "L'oracolo è momentaneamente in meditazione profonda. La connessione sarà ripristinata presto.",
];

function localFallback(): string {
  return OFFLINE[Math.floor(Math.random() * OFFLINE.length)];
}
