import { useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getDailyCard, getThreeCardSpread, type TarotCard } from '@/lib/tarot';
import { TAROT_ART } from '@/lib/tarotArt';
import GlowCard from '@/components/GlowCard';
import { track } from '@/lib/analytics';

// --- Card components ---

function CardBack() {
  return (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #1e0d38 0%, #0d0d24 50%, #0a1828 100%)',
        border: '1.5px solid rgba(212,168,67,0.45)',
        boxShadow: '0 0 24px rgba(212,168,67,0.15), inset 0 0 40px rgba(124,58,237,0.08)',
      }}
    >
      <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[12%] left-[18%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/35 top-[8%] right-[22%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/40 top-[28%] right-[10%]" />
      <div className="absolute w-1 h-1 rounded-full bg-teal-300/30 bottom-[14%] right-[18%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 bottom-[10%] left-[22%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 top-[45%] left-[8%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-yellow-200/30 top-[38%] right-[8%]" />
      <div className="absolute inset-2.5 rounded-xl border border-[rgba(212,168,67,0.22)]" />
      <div className="absolute inset-[18px] rounded-lg border border-[rgba(212,168,67,0.12)]" />
      <span className="absolute top-[14px] left-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <span className="absolute top-[14px] right-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <span className="absolute bottom-[14px] left-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <span className="absolute bottom-[14px] right-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <div className="relative flex flex-col items-center gap-1.5">
        <div className="absolute w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.2) 0%, transparent 70%)' }} />
        <div className="text-3xl text-[#d4a843] relative" style={{ filter: 'drop-shadow(0 0 12px rgba(212,168,67,0.8))' }}>✦</div>
        <p className="text-[6px] tracking-[0.35em] text-[#d4a843] opacity-50 font-semibold uppercase relative">Katharsis</p>
      </div>
    </div>
  );
}

function CardFront({ card }: { card: TarotCard }) {
  const art = TAROT_ART[card.id];
  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden relative"
      style={{
        background: `linear-gradient(160deg, ${card.color}55 0%, #0c082a 45%, #060212 100%)`,
        border: `1.5px solid ${card.color}80`,
        boxShadow: `0 0 22px ${card.color}35, inset 0 0 30px ${card.color}12`,
      }}
    >
      {/* Full illustration */}
      {art && (
        <svg viewBox="0 0 140 210" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
          {art(card.color, 140, 210)}
        </svg>
      )}

      {/* Numeral — top overlay */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-2.5 pt-2 z-10">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${card.color}50)` }} />
        <p className="text-[8px] font-semibold tracking-[0.25em] uppercase" style={{ color: card.color }}>{card.numeral}</p>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${card.color}50)` }} />
      </div>

      {/* Central emoji with glow */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full scale-[2.5]" style={{ background: `radial-gradient(circle, ${card.color}35 0%, transparent 70%)` }} />
          <span className="text-5xl relative" style={{ filter: `drop-shadow(0 0 18px ${card.color}) drop-shadow(0 0 8px ${card.color})` }}>
            {card.symbol}
          </span>
        </div>
      </div>

      {/* Name — bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 text-center z-10">
        <div className="h-px w-10 mx-auto rounded-full mb-1.5" style={{ background: `${card.color}60` }} />
        <p className="font-display font-bold text-[10px] leading-tight" style={{ color: card.color }}>
          {card.name}
        </p>
      </div>
    </div>
  );
}

function FlipCard({
  card,
  onFlip,
  flipped,
  reducedMotion,
}: {
  card: TarotCard;
  onFlip: () => void;
  flipped: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: '140px', height: '210px', perspective: '900px' }}
      onClick={() => !flipped && onFlip()}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.65, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as React.CSSProperties}>
          <CardBack />
        </div>
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' } as React.CSSProperties}>
          <CardFront card={card} />
        </div>
      </motion.div>

      {!flipped && (
        <motion.div
          className="absolute -bottom-7 left-0 right-0 text-center text-[10px] text-white/35 font-body"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          tocca per rivelare
        </motion.div>
      )}
    </div>
  );
}

function SmallCard({ card, label }: { card: TarotCard; label: string }) {
  const art = TAROT_ART[card.id];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          width: '88px', height: '132px',
          background: `linear-gradient(160deg, ${card.color}52 0%, #080614 100%)`,
          border: `1.5px solid ${card.color}70`,
          boxShadow: `0 0 14px ${card.color}30, inset 0 0 16px ${card.color}10`,
        }}
      >
        {/* Illustration */}
        {art && (
          <svg viewBox="0 0 88 132" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
            {art(card.color, 88, 132)}
          </svg>
        )}

        {/* Numeral */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-1 px-1.5 pt-1.5 z-10">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${card.color}45)` }} />
          <p className="text-[6px] font-semibold tracking-widest uppercase" style={{ color: card.color }}>{card.numeral}</p>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${card.color}45)` }} />
        </div>

        {/* Emoji */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-2xl" style={{ filter: `drop-shadow(0 0 10px ${card.color})` }}>{card.symbol}</span>
        </div>

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 pb-1.5 text-center z-10">
          <p className="font-display font-bold text-[7px] leading-tight px-1" style={{ color: `${card.color}ee` }}>
            {card.name}
          </p>
        </div>
      </div>
      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/35">{label}</p>
    </div>
  );
}

function CardHeroVisual({ card, flipped, reducedMotion, onFlip }: { card: TarotCard; flipped: boolean; reducedMotion: boolean; onFlip: () => void }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #100a2e 0%, #050312 100%)' }}
    >
      <div className="absolute w-1 h-1 rounded-full bg-white/45 top-[15%] left-[12%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/30 top-[10%] right-[18%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/40 top-[30%] right-[8%]" />
      <div className="absolute w-1 h-1 rounded-full bg-teal-300/25 bottom-[18%] right-[12%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/35 bottom-[12%] left-[16%]" />
      <motion.div
        className="absolute w-44 h-44 rounded-full"
        style={{ background: `radial-gradient(circle, ${card.color}30 0%, transparent 70%)` }}
        animate={{ opacity: flipped ? 1 : 0.35 }}
        transition={{ duration: 0.5 }}
      />
      <FlipCard card={card} onFlip={onFlip} flipped={flipped} reducedMotion={reducedMotion} />
    </div>
  );
}

export default function Carte() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile } = useApp();
  const sign = userProfile?.zodiac_sign || 'Leone';
  const isPremium = userProfile?.subscription_status === 'premium';

  const dailyCard = getDailyCard(sign);
  const [flipped, setFlipped] = useState(false);
  const [showSpread, setShowSpread] = useState(false);
  const [spreadUnlocked, setSpreadUnlocked] = useState(false);
  const spread = getThreeCardSpread(sign);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">TAROT</p>
        <h1 className="font-display font-light text-[#f0eeff] text-2xl mb-1">Carte</h1>
        <p className="text-white/40 font-body text-sm">La tua guida del giorno attraverso i Grandi Arcani</p>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <GlowCard
          glowColor="purple"
          heroSlot={
            <CardHeroVisual
              card={dailyCard}
              flipped={flipped}
              reducedMotion={!!shouldReduceMotion}
              onFlip={() => { setFlipped(true); track('tarot_card_revealed', { card: dailyCard.name, sign }); }}
            />
          }
          heroHeight="h-56"
          className="p-5"
          animate={false}
        >
          <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">CARTA DEL GIORNO</p>

          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div key="hidden" exit={{ opacity: 0 }}>
                <h2 className="font-display font-bold text-white text-xl mb-1">La tua carta ti attende</h2>
                <p className="text-white/45 font-body text-sm mb-4">Tocca la carta per scoprire il messaggio di oggi</p>
                <button
                  onClick={() => { setFlipped(true); track('tarot_card_revealed', { card: dailyCard.name, sign }); }}
                  className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #d4a843)' }}
                >
                  Rivela la carta
                </button>
              </motion.div>
            ) : (
              <motion.div key="revealed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-display font-bold text-xl mb-1" style={{ color: dailyCard.color }}>{dailyCard.name}</h2>
                <p className="text-white/60 font-body text-xs font-semibold uppercase tracking-widest mb-2">{dailyCard.meaning}</p>
                <p className="text-white/60 font-body text-sm leading-relaxed">{dailyCard.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlowCard>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!showSpread ? (
          <GlowCard className="p-5 text-center" animate={false}>
            <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">SPREAD</p>
            <h3 className="font-display font-light text-[#f0eeff] text-lg mb-1">Spread a 3 Carte</h3>
            <p className="text-white/45 font-body text-sm mb-4">Passato · Presente · Futuro — una visione più profonda del tuo percorso</p>
            {isPremium || spreadUnlocked ? (
              <button
                onClick={() => { setShowSpread(true); track('tarot_spread_opened'); }}
                className="w-full py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95"
              >
                Apri lo spread
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setSpreadUnlocked(true); setShowSpread(true); track('tarot_spread_unlocked', { method: 'premium_click' }); }}
                  className="w-full py-3 rounded-full text-white font-semibold text-sm mb-3 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #7c3aed 100%)' }}
                >
                  Sblocca lo Spread — Premium
                </button>
                <button
                  onClick={() => { setSpreadUnlocked(true); setShowSpread(true); track('tarot_spread_unlocked', { method: 'free_trial' }); }}
                  className="text-white/30 font-body text-xs hover:text-white/50 transition-colors"
                >
                  Prova gratis (1 volta)
                </button>
              </>
            )}
          </GlowCard>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlowCard glowColor="teal" className="p-5" animate={false}>
              <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">SPREAD · TRE CARTE</p>
              <h3 className="font-display font-light text-[#f0eeff] text-lg mb-4">Il tuo percorso</h3>

              <div className="flex justify-around mb-5">
                <SmallCard card={spread[0]} label="Passato" />
                <SmallCard card={spread[1]} label="Presente" />
                <SmallCard card={spread[2]} label="Futuro" />
              </div>

              <div className="space-y-3">
                {[{ label: 'Passato', card: spread[0] }, { label: 'Presente', card: spread[1] }, { label: 'Futuro', card: spread[2] }].map(({ label, card }) => (
                  <div key={label} className="border border-white/6 rounded-xl p-3 bg-surface-2/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: card.color, boxShadow: `0 0 6px ${card.color}88` }} />
                      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/40">{label} · {card.name}</p>
                    </div>
                    <p className="text-white/60 font-body text-xs leading-relaxed">{card.meaning}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSpread(false)}
                className="mt-4 w-full py-2.5 rounded-full border border-white/10 text-white/35 text-sm hover:text-white/55 hover:border-white/20 transition-colors"
              >
                Chiudi spread
              </button>
            </GlowCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
