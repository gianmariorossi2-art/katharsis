import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/analytics';
import GemCounter, { GemToast } from '@/components/GemCounter';
import StreakBadge from '@/components/StreakBadge';
import type { DailyReading } from '@/types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Buonanotte';
  if (h < 12) return 'Buongiorno';
  if (h < 18) return 'Buon pomeriggio';
  return 'Buonasera';
}

function formatDate(): string {
  return new Date().toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' });
}

// ─── Energy color map ─────────────────────────────────────────────────────────

const ENERGIA_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  espansiva: { bg: 'rgba(248,200,80,0.12)',   text: '#F8C850', label: 'Espansiva' },
  contratta: { bg: 'rgba(107,78,155,0.2)',    text: '#a78bfa', label: 'Contratta' },
  creativa:  { bg: 'rgba(232,134,60,0.15)',   text: '#F28A3C', label: 'Creativa'  },
  neutrale:  { bg: 'rgba(184,201,217,0.1)',   text: '#B8C9D9', label: 'Neutrale'  },
};

const ARCANO_SYMBOL: Record<string, string> = {
  'Il Matto':'🌀','Il Bagatto':'🎩','La Papessa':'📖','L\'Imperatrice':'🌿',
  'L\'Imperatore':'👑','Il Papa':'🕊️','Gli Amanti':'💞','Il Carro':'🏆',
  'La Giustizia':'⚖️','L\'Eremita':'🕯️','La Ruota':'☸️','La Forza':'🦁',
  'L\'Appeso':'🌊','La Morte':'🌑','La Temperanza':'💧','Il Diavolo':'🔗',
  'La Torre':'⚡','Le Stelle':'🌟','La Luna':'🌙','Il Sole':'☀️',
  'Il Giudizio':'📯','Il Mondo':'🌍',
};
const SEME_SYMBOL: Record<string, string> = { Bastoni:'🔥', Coppe:'🌊', Spade:'⚔️', Denari:'🪙' };

function arcanoSymbol(nome: string): string {
  return ARCANO_SYMBOL[nome] ?? '✨';
}

// ─── Cosmic loading animation ─────────────────────────────────────────────────

function CosmicLoader() {
  const msgs = [
    'I pianeti si allineano…',
    'Gli arcani si dispongono…',
    'Il mantra prende forma…',
    'La lettura si rivela…',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed 60%, #2e0a70)',
          boxShadow: '0 0 40px rgba(124,58,237,0.5)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white text-xl">✦</div>
      </motion.div>
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="font-body text-[#6b6491] text-sm italic"
      >
        {msgs[idx]}
      </motion.p>
    </div>
  );
}

// ─── Empty state — no birth data ──────────────────────────────────────────────

function NoBirthDataCard({ onGenerate, loading }: { onGenerate: () => void; loading: boolean }) {
  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{
        background: 'rgba(13,11,30,0.95)',
        border: '1px solid rgba(167,139,250,0.2)',
        boxShadow: '0 0 40px rgba(124,58,237,0.15)',
      }}
    >
      <div className="text-4xl mb-4">🌙</div>
      <h3 className="font-display font-light text-[#f0eeff] text-xl mb-2">
        La tua lettura ti aspetta
      </h3>
      <p className="font-body text-[#6b6491] text-sm mb-6 leading-relaxed">
        Per una lettura astrologica completa inserisci la tua data di nascita nel profilo.
        Puoi comunque generare una lettura generale.
      </p>
      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3 rounded-full font-label text-sm tracking-[0.1em] text-white disabled:opacity-50 transition-all"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
      >
        {loading ? '✦ Generazione…' : '✦ Genera lettura del giorno'}
      </button>
    </div>
  );
}

// ─── Generate button (when reading exists but user wants new one) ─────────────

function RegenerateButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-2 rounded-full font-body text-[#4a4468] text-xs hover:text-[#9b93c4] transition-colors disabled:opacity-40"
    >
      {loading ? '…aggiornamento' : '↻ Rigenera lettura'}
    </button>
  );
}

// ─── Full reading card ────────────────────────────────────────────────────────

function ReadingCard({ reading }: { reading: DailyReading }) {
  const en = ENERGIA_STYLE[reading.energia_giorno] ?? ENERGIA_STYLE.neutrale;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="space-y-3">

      {/* Image from Gemini (if available) */}
      <AnimatePresence>
        {reading.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(167,139,250,0.15)' }}
          >
            <img
              src={reading.image_url}
              alt="Immagine simbolista del giorno"
              className="w-full aspect-square object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mantra */}
      <div
        className="rounded-2xl p-5 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1540 0%, #2a1a5e 50%, #1e1540 100%)',
          border: '1px solid rgba(201,168,76,0.35)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08), transparent 70%)' }}
        />
        <p className="font-label text-[9px] tracking-[0.3em] text-[#d4a843] uppercase mb-3">
          ✦ Mantra del Giorno ✦
        </p>
        <p className="font-display font-light text-[#e8c97a] text-lg leading-snug italic">
          "{reading.mantra_giorno}"
        </p>
      </div>

      {/* Arcani grid */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <p className="font-label text-[8px] tracking-[0.2em] text-[#4a4468] uppercase mb-2">Arcano Maggiore</p>
          <div className="text-3xl mb-1">{arcanoSymbol(reading.arcano_maggiore.nome)}</div>
          <p className="font-display text-[#d4a843] text-xs mb-2">
            {reading.arcano_maggiore.numero} — {reading.arcano_maggiore.nome}
          </p>
          <p className="font-body text-[#6b6491] text-xs leading-relaxed italic">
            {reading.arcano_maggiore.significato_oggi}
          </p>
        </div>
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <p className="font-label text-[8px] tracking-[0.2em] text-[#4a4468] uppercase mb-2">Arcano Minore</p>
          <div className="text-3xl mb-1">{SEME_SYMBOL[reading.arcano_minore.seme] ?? '✦'}</div>
          <p className="font-display text-[#d4a843] text-xs mb-2">{reading.arcano_minore.nome}</p>
          <p className="font-body text-[#6b6491] text-xs leading-relaxed italic">
            {reading.arcano_minore.significato_oggi}
          </p>
        </div>
      </div>

      {/* Oroscopo */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(139,92,246,0.12)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <p className="font-label text-[9px] tracking-[0.25em] text-[#d4a843] uppercase">
            Lettura del Giorno
          </p>
          <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.2)' }} />
        </div>
        <p className="font-body text-[#c4bde8] text-sm leading-relaxed">
          {reading.oroscopo_giorno}
        </p>
      </div>

      {/* Transito + Energia + Colore */}
      <div className="grid grid-cols-2 gap-3">
        {/* Focus */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(139,92,246,0.12)' }}
        >
          <p className="font-label text-[8px] tracking-[0.2em] text-[#4a4468] uppercase mb-3">Focus</p>
          <div className="flex flex-wrap gap-1">
            {reading.focus_aree.map(a => (
              <span
                key={a}
                className="font-body text-[11px] px-2 py-1 rounded-full capitalize"
                style={{ background: 'rgba(107,78,155,0.2)', border: '1px solid rgba(107,78,155,0.3)', color: '#b8c9d9' }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
        {/* Energia + Colore */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(139,92,246,0.12)' }}
        >
          <p className="font-label text-[8px] tracking-[0.2em] text-[#4a4468] uppercase mb-3">Energia · Colore</p>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: reading.colore_giorno, border: '1px solid rgba(255,255,255,0.2)' }}
            />
            <span
              className="font-body text-xs px-2 py-0.5 rounded-full italic"
              style={{ background: en.bg, color: en.text }}
            >
              {en.label}
            </span>
          </div>
        </div>
      </div>

      {/* Transito principale */}
      {reading.transito_principale && (
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          <p className="font-label text-[8px] tracking-[0.2em] text-[#4a4468] uppercase mb-1">Influsso del giorno</p>
          {reading.transito_principale.messaggio && (
            <p className="font-body text-[#c4bde8] text-sm mb-2">
              {reading.transito_principale.messaggio}
            </p>
          )}
          <p className="font-body text-[#4a4468] text-[11px]">
            {reading.transito_principale.pianeta_transitante} in {reading.transito_principale.aspetto}
            {' · '}casa {reading.transito_principale.casa_coinvolta}
            {' · '}orbe {reading.transito_principale.orbe}
          </p>
        </div>
      )}

      {/* Nota tecnica (for power users) */}
      {reading.nota_tecnica && (
        <p className="font-body text-[#4a4468] text-xs text-center italic px-2">
          {reading.nota_tecnica}
        </p>
      )}
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile, isLoading, dailyReading, dailyReadingLoading, generateReading } = useApp();
  const [gemToast, setGemToast] = useState<number | null>(null);

  // Auto-generate on first load if profile has birth data and no reading today
  useEffect(() => {
    if (!isLoading && userProfile && !dailyReading && !dailyReadingLoading) {
      generateReading().then(() => {
        track('daily_reading_generated', { sign: userProfile.zodiac_sign, has_birth: !!userProfile.birth_date });
      }).catch(() => {});
    }
  }, [isLoading, userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const name = userProfile?.name || 'Viandante';

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      {gemToast !== null && (
        <GemToast amount={gemToast} onDone={() => setGemToast(null)} />
      )}

      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
          KATHARSIS
        </p>
        <h1 className="font-display text-[2rem] font-light tracking-[0.02em] text-[#f0eeff] mb-1">
          {getGreeting()}, {name}
        </h1>
        <p className="font-label text-[#d4a843] text-sm tracking-[0.15em] capitalize">
          {formatDate()}
        </p>
        <div className="flex items-center gap-2 mt-3">
          {userProfile && <StreakBadge streak={userProfile.current_streak} />}
          {userProfile && <GemCounter count={userProfile.gems} />}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading || (dailyReadingLoading && !dailyReading) ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CosmicLoader />
          </motion.div>
        ) : dailyReading ? (
          <motion.div
            key="reading"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <ReadingCard reading={dailyReading} />
            <RegenerateButton onClick={generateReading} loading={dailyReadingLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NoBirthDataCard onGenerate={generateReading} loading={dailyReadingLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      {dailyReading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-[#2a2545] text-xs text-center mt-4 px-4"
        >
          App per intrattenimento · Calcoli astronomici con algoritmi Jean Meeus
        </motion.p>
      )}
    </div>
  );
}
