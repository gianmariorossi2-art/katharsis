import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getDailyCard, getThreeCardSpread, type TarotCard } from '@/lib/tarot';
import GlowCard from '@/components/GlowCard';

function CardBack() {
  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col items-center justify-center border border-purple-500/30"
      style={{
        background: 'linear-gradient(135deg, #0f0a2e 0%, #041f1e 100%)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Star pattern */}
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/30 top-3 left-4" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-teal-300/30 bottom-3 right-4" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 top-4 right-6" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/30 bottom-4 left-6" />

      {/* Border inside */}
      <div className="absolute inset-2 rounded-xl border border-purple-500/15" />

      {/* Central symbol */}
      <div className="text-3xl" style={{ filter: 'drop-shadow(0 0 10px rgba(124,58,237,0.5))' }}>
        ✦
      </div>
    </div>
  );
}

function CardFront({ card }: { card: TarotCard }) {
  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col items-center justify-between p-3 border"
      style={{
        background: `linear-gradient(160deg, ${card.color}18 0%, #0a0820 50%, #080614 100%)`,
        borderColor: `${card.color}40`,
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      <p
        className="text-[9px] font-semibold tracking-[0.2em] uppercase text-center"
        style={{ color: card.color }}
      >
        {card.numeral}
      </p>
      <div
        className="text-4xl"
        style={{ filter: `drop-shadow(0 0 14px ${card.color}88)` }}
      >
        {card.symbol}
      </div>
      <p
        className="font-display font-bold text-xs text-center leading-tight"
        style={{ color: card.color }}
      >
        {card.name}
      </p>
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
        {/* Back face */}
        <div className="absolute inset-0">
          <CardBack />
        </div>
        {/* Front face */}
        <div className="absolute inset-0">
          <CardFront card={card} />
        </div>
      </motion.div>

      {/* Tap hint */}
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
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-xl flex flex-col items-center justify-between p-2 border"
        style={{
          width: '88px', height: '132px',
          background: `linear-gradient(160deg, ${card.color}15 0%, #080614 100%)`,
          borderColor: `${card.color}35`,
        }}
      >
        <p className="text-[8px] font-semibold tracking-widest uppercase" style={{ color: card.color }}>
          {card.numeral}
        </p>
        <div className="text-2xl" style={{ filter: `drop-shadow(0 0 10px ${card.color}66)` }}>
          {card.symbol}
        </div>
        <p className="font-display font-bold text-[9px] text-center leading-tight" style={{ color: card.color }}>
          {card.name}
        </p>
      </div>
      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/35">{label}</p>
    </div>
  );
}

function CardHeroVisual({ card, flipped, reducedMotion }: { card: TarotCard; flipped: boolean; reducedMotion: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #0f0a2e 0%, #050312 100%)' }}
    >
      {/* Stars */}
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 top-4 left-8" />
      <div className="absolute w-1 h-1 rounded-full bg-white/20 top-5 right-10" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/30 top-3 right-1/4" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 bottom-4 left-16" />

      {/* Glow when flipped */}
      {flipped && (
        <motion.div
          className="absolute w-40 h-40 rounded-full"
          style={{ background: `radial-gradient(circle, ${card.color}20 0%, transparent 70%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <FlipCard card={card} onFlip={() => {}} flipped={flipped} reducedMotion={reducedMotion} />
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
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
          TAROT
        </p>
        <h1 className="font-display font-bold text-white text-2xl mb-1">Carte</h1>
        <p className="text-white/40 font-body text-sm">
          La tua guida del giorno attraverso i Grandi Arcani
        </p>
      </motion.div>

      {/* Daily card — hero card with flip inside */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <GlowCard
          glowColor="purple"
          heroSlot={
            <CardHeroVisual card={dailyCard} flipped={flipped} reducedMotion={!!shouldReduceMotion} />
          }
          heroHeight="h-56"
          className="p-5"
          animate={false}
        >
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
            CARTA DEL GIORNO
          </p>

          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div key="hidden" exit={{ opacity: 0 }}>
                <h2 className="font-display font-bold text-white text-xl mb-1">
                  La tua carta ti attende
                </h2>
                <p className="text-white/45 font-body text-sm mb-4">
                  Tocca la carta per scoprire il messaggio di oggi
                </p>
                <button
                  onClick={() => setFlipped(true)}
                  className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
                >
                  Rivela la carta
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2
                  className="font-display font-bold text-xl mb-1"
                  style={{ color: dailyCard.color }}
                >
                  {dailyCard.name}
                </h2>
                <p className="text-white/60 font-body text-xs font-semibold uppercase tracking-widest mb-2">
                  {dailyCard.meaning}
                </p>
                <p className="text-white/60 font-body text-sm leading-relaxed">
                  {dailyCard.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlowCard>
      </motion.div>

      {/* 3-Card spread */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!showSpread ? (
          <GlowCard className="p-5 text-center" animate={false}>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
              SPREAD
            </p>
            <h3 className="font-display font-bold text-white text-lg mb-1">
              Spread a 3 Carte
            </h3>
            <p className="text-white/45 font-body text-sm mb-4">
              Passato · Presente · Futuro — una visione più profonda del tuo percorso
            </p>
            {isPremium || spreadUnlocked ? (
              <button
                onClick={() => setShowSpread(true)}
                className="w-full py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95"
              >
                Apri lo spread
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setSpreadUnlocked(true); setShowSpread(true); }}
                  className="w-full py-3 rounded-full text-white font-semibold text-sm mb-3 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #7c3aed 100%)' }}
                >
                  Sblocca lo Spread — Premium
                </button>
                <button
                  onClick={() => { setSpreadUnlocked(true); setShowSpread(true); }}
                  className="text-white/30 font-body text-xs hover:text-white/50 transition-colors"
                >
                  Prova gratis (1 volta)
                </button>
              </>
            )}
          </GlowCard>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GlowCard glowColor="teal" className="p-5" animate={false}>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
                SPREAD · TRE CARTE
              </p>
              <h3 className="font-display font-bold text-white text-lg mb-4">
                Il tuo percorso
              </h3>

              {/* The three cards */}
              <div className="flex justify-around mb-5">
                <SmallCard card={spread[0]} label="Passato" />
                <SmallCard card={spread[1]} label="Presente" />
                <SmallCard card={spread[2]} label="Futuro" />
              </div>

              {/* Interpretation */}
              <div className="space-y-3">
                {[
                  { label: 'Passato', card: spread[0] },
                  { label: 'Presente', card: spread[1] },
                  { label: 'Futuro', card: spread[2] },
                ].map(({ label, card }) => (
                  <div key={label} className="border border-white/6 rounded-xl p-3 bg-surface-2/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ background: card.color, boxShadow: `0 0 6px ${card.color}88` }}
                      />
                      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/40">
                        {label} · {card.name}
                      </p>
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
