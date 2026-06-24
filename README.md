# Katharsis — Il Tuo Oracolo Personale

Un'app di oroscopo personalizzato con gamification, tracker dell'aura e oracolo conversazionale. Costruita come monorepo con React + Vite sul client e Node + Express sul server.

---

## Struttura del progetto

```
/
├── client/              # React + Vite + TypeScript + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/  # Componenti riutilizzabili (GlowCard, AuraOrb, ecc.)
│   │   ├── contexts/    # AppContext (stato globale + mock data)
│   │   ├── lib/         # Logica business (gamification, oroscopo, aura, oracle)
│   │   ├── pages/       # Pagine: Home, Oracle, Aura, Profile
│   │   └── types/       # Tipi TypeScript condivisi
│   └── .env.example
├── server/              # Node + Express + TypeScript
│   ├── src/
│   │   ├── routes/      # horoscope.ts, oracle.ts, stripe.ts
│   │   └── index.ts     # Entry point del server
│   └── .env.example
├── supabase/
│   └── schema.sql       # Schema SQL con RLS per Supabase
└── README.md
```

---

## Setup rapido

### 1. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Il client funziona in **modalità mock** senza env vars — nessun Supabase o server richiesti per sviluppare l'UI.

### 2. Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Il server parte sulla porta 3001 per default.

---

## Variabili d'ambiente

### `/client/.env`

| Variabile | Descrizione |
|-----------|-------------|
| `VITE_SUPABASE_URL` | URL del tuo progetto Supabase (es. `https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Chiave pubblica anon di Supabase |
| `VITE_API_URL` | URL del server backend (default `http://localhost:3001`) |

### `/server/.env`

| Variabile | Descrizione |
|-----------|-------------|
| `PORT` | Porta del server (default `3001`) |
| `CLIENT_URL` | URL del client per CORS (default `http://localhost:5173`) |
| `STRIPE_SECRET_KEY` | Chiave segreta Stripe (inizia con `sk_test_` o `sk_live_`) |
| `STRIPE_WEBHOOK_SECRET` | Secret per verificare i webhook Stripe (`whsec_...`) |
| `OPENAI_API_KEY` | Chiave API OpenAI per l'oracolo reale (futuro) |

---

## Setup Supabase

1. Crea un nuovo progetto su [supabase.com](https://supabase.com)
2. Vai su **SQL Editor** e incolla il contenuto di `supabase/schema.sql`
3. Esegui lo script
4. Vai su **Authentication → Providers** e abilita "Email" (o Google/GitHub per OAuth)
5. Copia l'**URL** e la **chiave anon** da **Settings → API**
6. Incollali nel file `client/.env`

---

## Come funziona la modalità mock

L'app funziona completamente senza Supabase o server grazie a `AppContext.tsx` che fornisce:
- Un utente mock (Leone, livello 3, 142 gemme, serie di 5)
- 13 check-in degli ultimi giorni precompilati
- Tutte le operazioni (aggiungi check-in, rivela oroscopo, ecc.) funzionano in memoria

Per connettere Supabase, aggiungi le env vars e sostituisci le funzioni in `AppContext.tsx` con chiamate reali a `supabase`.

---

## Deploy su Railway

### Client (sito statico)

```bash
cd client
npm run build
# La cartella dist/ contiene il sito statico
```

Crea un servizio **Static Site** su Railway, punta alla cartella `client/`, build command: `npm run build`, publish dir: `dist`.

### Server (Node.js)

Crea un servizio **Node.js** su Railway, punta alla cartella `server/`, start command: `npm start`.

Aggiungi le variabili d'ambiente nel pannello di Railway.

---

## API Endpoints

| Metodo | Route | Descrizione |
|--------|-------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/horoscope` | Genera oroscopo mock (body: `{ sign, mood }`) |
| `POST` | `/api/oracle` | Risposta oracolo mock (body: `{ question }`) |
| `POST` | `/api/stripe/checkout` | Crea sessione checkout Stripe (placeholder) |
| `POST` | `/api/stripe/webhook` | Riceve webhook Stripe (placeholder) |

---

## Prossimi passi

### Oracolo AI reale
1. Sostituisci `client/src/lib/oracle.ts` → `getOracleResponse()` con una chiamata a `/api/oracle`
2. Sostituisci `server/src/routes/oracle.ts` con una chiamata reale a OpenAI/Anthropic API
3. Aggiungi `OPENAI_API_KEY` (o `ANTHROPIC_API_KEY`) alle env del server

### Stripe reale
1. Crea i prodotti e prezzi su [stripe.com](https://stripe.com)
2. Sostituisci `/api/stripe/checkout` con `stripe.checkout.sessions.create(...)`
3. Implementa la gestione webhook in `/api/stripe/webhook` per aggiornare `subscription_status` su Supabase

### Supabase Auth
1. Sostituisci il mock user in `AppContext.tsx` con `supabase.auth.getSession()`
2. Implementa login/signup con `supabase.auth.signInWithPassword()` o OAuth
3. Collega tutte le operazioni del context alle chiamate Supabase corrispondenti

---

*App per intrattenimento. Nessuna garanzia scientifica derivante dall'uso di questo software.*
