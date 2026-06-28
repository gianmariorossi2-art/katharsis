import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { calculateNatalChart, julianDay } from './_astrology.js';

export const maxDuration = 120;

const claude = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const OPENAI_KEY = process.env.OPENAI_API_KEY || ''; // opzionale, non più usato per immagini

// ─── Natal chart → formatted block ───────────────────────────────────────────

function formatNatalBlock(nc: ReturnType<typeof calculateNatalChart>): string {
  function p(label: string, pos: { sign: string; degrees: string; casa: number }) {
    return `${label}: ${pos.sign} ${pos.degrees}, Casa ${pos.casa}`;
  }
  return `NATAL_SOLE: ${p('', nc.sole).trim()}
NATAL_LUNA: ${p('', nc.luna).trim()}
NATAL_ASCENDENTE: ${nc.ascendente.sign} ${nc.ascendente.degrees}
NATAL_MEDIO_CIELO: ${nc.medio_cielo.sign} ${nc.medio_cielo.degrees}
NATAL_MERCURIO: ${p('', nc.mercurio).trim()}
NATAL_VENERE: ${p('', nc.venere).trim()}
NATAL_MARTE: ${p('', nc.marte).trim()}
NATAL_GIOVE: ${p('', nc.giove).trim()}
NATAL_SATURNO: ${p('', nc.saturno).trim()}
NATAL_URANO: ${p('', nc.urano).trim()}
NATAL_NETTUNO: ${p('', nc.nettuno).trim()}
NATAL_PLUTONE: ${p('', nc.plutone).trim()}
NATAL_NODO_NORD: ${p('', nc.nodo_nord).trim()}
NATAL_CHIRONE: ${p('', nc.chirone).trim()}
ELEMENTO_DOMINANTE: ${nc.elemento_dominante}
PIANETA_DOMINANTE: ${nc.pianeta_dominante}
CONFIGURAZIONE: ${nc.configurazione_principale ?? 'nessuna'}
SISTEMA_CASE: Placidus`;
}

// ─── Arcane numerical method (fallback) ──────────────────────────────────────

const ARCANA = ['Il Matto','Il Bagatto','La Papessa','L\'Imperatrice','L\'Imperatore',
  'Il Papa','Gli Amanti','Il Carro','La Giustizia','L\'Eremita','La Ruota',
  'La Forza','L\'Appeso','La Morte','La Temperanza','Il Diavolo',
  'La Torre','Le Stelle','La Luna','Il Sole','Il Giudizio','Il Mondo'];

function numericalArcano(dateStr: string): { numero: string; nome: string } {
  const sum = dateStr.replace(/-/g,'').split('').reduce((a,c) => a + parseInt(c,10), 0);
  let n = sum;
  while (n > 21) n = String(n).split('').reduce((a,c) => a + parseInt(c,10), 0);
  const romanals = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X',
    'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
  return { numero: romanals[n] || '0', nome: ARCANA[n] || 'Il Matto' };
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM = `Sei un astrologo e tarologo professionista di altissimo livello specializzato nel Tarot di Marsiglia.
Ogni giorno ricevi il tema natale completo di un utente (calcolato con Swiss Ephemeris) e la data odierna.
Il tuo compito è generare la lettura completa del giorno.

PROCESSO INTERNO (esegui silenziosamente prima di scrivere):
1. Stima le posizioni planetarie odierne (Sole ~1°/giorno, Saturno ~0.033°/g, Giove ~0.083°/g, ecc.)
2. Compara con il tema natale fornito: trova il transito più significativo (pianeta transitante × punto natale, orbe < 5°)
   Priorità: Saturno > Giove > Marte > Venere > Mercurio > Luna
3. Mappa il pianeta dominante all'arcano maggiore (tabella corrispondenze standard):
   Sole(armonico)→XIX Il Sole | Sole(difficile)→XVI La Torre | Luna(crescente)→II La Papessa |
   Luna(piena)→XVIII La Luna | Luna(calante)→XII L'Appeso | Mercurio→I Il Bagatto |
   Venere(arm.)→III L'Imperatrice / VI Gli Amanti | Venere(diff.)→XV Il Diavolo |
   Marte(costr.)→VII Il Carro | Marte(diff.)→XVI La Torre | Giove→X La Ruota / XI La Forza |
   Saturno(costr.)→XXI Il Mondo / IV L'Imperatore | Saturno(diff.)→XV Il Diavolo / VIII La Giustizia |
   Urano→0 Il Matto / XVI La Torre | Nettuno→XII L'Appeso / XVII Le Stelle | Plutone→XIII La Morte |
   Nodo Nord→XX Il Giudizio | Chirone→IX L'Eremita
4. Scegli arcano minore: seme=elemento del transito (Bastoni=Fuoco, Coppe=Acqua, Spade=Aria, Denari=Terra),
   numero=casa natale coinvolta
5. Genera mantra: prima persona singolare, tempo presente, max 12 parole, poetico e concreto
6. Componi gemini_prompt in inglese (80-120 parole) per generazione immagine simbolista medievale

REGOLE OBBLIGATORIE:
- Oroscopo: 150-200 parole, seconda persona, profondo e personalizzato al tema natale specifico
- Mai usare: "segui il tuo cuore", "l'universo ti supporta", "andrà tutto bene"
- Ogni lettura deve essere distinguibile: cita posizioni planetarie natali specifiche
- Mantra: mai generico, deve riflettere il transito del giorno per QUESTA persona
- transito_principale.messaggio: frase in italiano semplice per l'utente medio, max 12 parole, senza gergo astrologico. Esempio: "Saturno porta chiarezza e struttura nella tua carriera oggi."
- JSON valido senza testo aggiuntivo prima o dopo, senza backtick, senza markdown

OUTPUT JSON (struttura esatta):
{
  "data": "YYYY-MM-DD",
  "nome_utente": "string",
  "transito_principale": {
    "pianeta_transitante": "string",
    "aspetto": "trigono|quadratura|opposizione|congiunzione|sestile",
    "punto_natale": "string",
    "orbe": "X°XX'",
    "casa_coinvolta": 0,
    "messaggio": "Frase semplice per l'utente medio, max 12 parole"
  },
  "oroscopo_giorno": "150-200 parole, seconda persona",
  "arcano_maggiore": { "numero": "I-XXI", "nome": "string", "significato_oggi": "2-3 frasi" },
  "arcano_minore": { "seme": "Bastoni|Coppe|Spade|Denari", "numero": "string", "nome": "string", "significato_oggi": "1-2 frasi" },
  "mantra_giorno": "max 12 parole, prima persona, presente",
  "focus_aree": ["area1", "area2"],
  "energia_giorno": "espansiva|contratta|neutrale|creativa",
  "colore_giorno": "#hexcode",
  "nota_tecnica": "string opzionale",
  "gemini_prompt": "80-120 parole in inglese per Imagen"
}`;

// ─── Build user message ───────────────────────────────────────────────────────

function buildMessage(
  nome: string,
  dateStr: string,
  natalBlock: string,
  zodiacSign: string,
): string {
  return `{
  "nome": "${nome}",
  "data_oggi": "${dateStr}",
  "segno_solare": "${zodiacSign}",
  "tema_natale": {
${natalBlock.split('\n').map(l => '    '+l).join('\n')}
  },
  "richiesta": "lettura_giornaliera"
}`;
}

// ─── Gemini Imagen ────────────────────────────────────────────────────────────

// Pollinations.ai — generazione immagini gratuita, nessuna API key richiesta
async function generateImage(prompt: string): Promise<string | null> {
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.slice(0, 500))}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now() % 9999}`;
    console.log('[pollinations] generating image...');
    const resp = await fetch(url, { signal: AbortSignal.timeout(50000) });
    if (!resp.ok) {
      console.error(`[pollinations] HTTP ${resp.status}`);
      return null;
    }
    const buf = await resp.arrayBuffer();
    const mime = resp.headers.get('content-type') || 'image/jpeg';
    console.log('[pollinations] image generated OK');
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`;
  } catch (err) {
    console.error('[pollinations] error:', err);
    return null;
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

function mockReading(nome: string, dateStr: string, zodiacSign: string): object {
  const { numero, nome: arcanoNome } = numericalArcano(dateStr);
  return {
    data: dateStr,
    nome_utente: nome,
    transito_principale: {
      pianeta_transitante: 'Saturno',
      aspetto: 'trigono',
      punto_natale: `Sole natale in ${zodiacSign}`,
      orbe: '2°30\'',
      casa_coinvolta: 10,
      messaggio: 'Saturno porta chiarezza e struttura nella tua carriera oggi.',
    },
    oroscopo_giorno: `Oggi il cielo parla direttamente al tuo tema natale in ${zodiacSign}. Saturno, pianeta della struttura e della maturazione, forma un aspetto significativo che richiede la tua attenzione non come ostacolo, ma come invito a costruire qualcosa di solido. L'energia del momento è densa ma fertile: quello che costruisci oggi ha la consistenza della pietra. La tua luna natale percepisce questa pressione prima ancora che la mente la elabori — fidati di quella sensazione corporea che arriva prima delle parole. Non è tempo di volare, è tempo di radicarsi.`,
    arcano_maggiore: {
      numero,
      nome: arcanoNome,
      significato_oggi: `${arcanoNome} risuona con il transito di oggi, portando un'energia di trasformazione e chiarezza strutturale. Questo arcano ti invita a guardare oltre la superficie delle circostanze.`,
    },
    arcano_minore: {
      seme: 'Denari',
      numero: '4',
      nome: 'Quattro di Denari',
      significato_oggi: 'Consolida ciò che hai costruito prima di espanderti. La stabilità è la tua alleata in questo momento.',
    },
    mantra_giorno: 'Costruisco oggi le fondamenta su cui domani mi eleverò.',
    focus_aree: ['carriera', 'struttura personale'],
    energia_giorno: 'contratta',
    colore_giorno: '#4A7C59',
    gemini_prompt: `Symbolic art in medieval tarot card style. Central figure: ${arcanoNome} as ancient archetype. Saturn as golden ringed sphere in upper left. ${zodiacSign} zodiac sigil subtly integrated in background. Four golden coins as detail in foreground. Color palette: forest green #4A7C59, antique gold #C9A84C, deep navy #1a1a3e. Clean lines, no photography, painterly quality, meditative atmosphere. No text, no faces, no recognizable people.`,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body as Record<string, unknown>;
  const nome       = (body.nome as string) || 'Viandante';
  const dateStr    = (body.date as string) || new Date().toISOString().split('T')[0];
  const zodiacSign = (body.zodiac_sign as string) || 'Leone';
  const birthDate  = body.birth_date as string | null;
  const birthTime  = (body.birth_time as string) || '12:00';
  const birthLat   = body.birth_lat as number | null;
  const birthLon   = body.birth_lon as number | null;

  let lat = birthLat, lon = birthLon;
  let natalChart: ReturnType<typeof calculateNatalChart> | null = null;

  // Geocode if coordinates are missing and birth_place provided
  if (birthDate && (!lat || !lon)) {
    const birthPlace = body.birth_place as string | null;
    if (birthPlace) {
      try {
        const geoResp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(birthPlace)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'Katharsis-App/1.0' } }
        );
        const geoData = await geoResp.json() as Array<{ lat: string; lon: string }>;
        if (geoData.length) {
          lat = parseFloat(geoData[0].lat);
          lon = parseFloat(geoData[0].lon);
        }
      } catch { /* geocoding optional */ }
    }
  }

  // Calculate natal chart if we have birth data
  if (birthDate && lat != null && lon != null) {
    try {
      natalChart = calculateNatalChart(birthDate, birthTime, lat, lon);
    } catch (err) {
      console.error('[natal-chart]', err);
    }
  }

  const natalBlock = natalChart ? formatNatalBlock(natalChart) : `NATAL_SOLE: ${zodiacSign}\nNATAL_ASCENDENTE: sconosciuto`;

  // Return mock if Claude is not configured
  if (!claude) {
    const mock = mockReading(nome, dateStr, zodiacSign);
    const imageUrl = await generateImage((mock as Record<string,unknown>).gemini_prompt as string);
    return res.json({
      reading: { ...mock, generated_at: new Date().toISOString(), image_url: imageUrl },
      natal_chart: natalChart,
      birth_lat: lat,
      birth_lon: lon,
      source: 'mock',
    });
  }

  // ─── Verify today's date is passed, otherwise compute from today ─────────────
  const [dy, dm, dd] = dateStr.split('-').map(Number);
  const jdToday = julianDay(dy, dm, dd, 12);
  void jdToday; // used for context (Claude computes transits itself)

  try {
    const message = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: buildMessage(nome, dateStr, natalBlock, zodiacSign),
      }],
    });

    const raw = message.content.find(b => b.type === 'text')?.type === 'text'
      ? (message.content.find(b => b.type === 'text') as { type: 'text'; text: string }).text
      : '';

    let reading: Record<string, unknown>;
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      reading = JSON.parse(clean);
    } catch {
      const mock = mockReading(nome, dateStr, zodiacSign);
      const imageUrl = await generateImage((mock as Record<string,unknown>).gemini_prompt as string);
      return res.json({
        reading: { ...mock, generated_at: new Date().toISOString(), image_url: imageUrl },
        natal_chart: natalChart, birth_lat: lat, birth_lon: lon, source: 'mock-parse-error',
      });
    }

    // Generate image from gemini_prompt
    const imageUrl = await generateImage(reading.gemini_prompt as string);
    reading.generated_at = new Date().toISOString();
    reading.image_url = imageUrl;

    return res.json({
      reading,
      natal_chart: natalChart,
      birth_lat: lat,
      birth_lon: lon,
      source: 'claude',
    });
  } catch (err) {
    console.error('[daily-reading]', err);
    const mock = mockReading(nome, dateStr, zodiacSign);
    return res.json({
      reading: { ...mock, generated_at: new Date().toISOString(), image_url: null },
      natal_chart: natalChart, birth_lat: lat, birth_lon: lon, source: 'error-fallback',
    });
  }
}
