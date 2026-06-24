const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/**
 * Sends the user's question to the Express server, which either calls Claude
 * (when ANTHROPIC_API_KEY is configured) or returns a keyword-based mock response.
 */
export async function getOracleResponse(question: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/oracle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = (await res.json()) as { response: string };
    return data.response;
  } catch {
    return localFallback(question);
  }
}

// Minimal inline fallback used only when the server is completely unreachable.
const OFFLINE_RESPONSES = [
  "Le stelle mi raggiungono con difficoltà in questo momento. Poni di nuovo la tua domanda tra poco — l'universo ascolterà.",
  "Il canale cosmico è temporaneamente disturbato. Riprova tra qualche istante.",
  "L'oracolo è momentaneamente in meditazione profonda. La connessione sarà ripristinata presto.",
];

function localFallback(question: string): string {
  let hash = 0;
  for (let i = 0; i < question.length; i++) {
    hash = (hash << 5) - hash + question.charCodeAt(i);
    hash = hash & hash;
  }
  return OFFLINE_RESPONSES[Math.abs(hash) % OFFLINE_RESPONSES.length];
}
