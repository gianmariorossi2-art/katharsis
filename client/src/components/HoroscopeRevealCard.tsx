import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SparkleField from './SparkleField';
import GlowCard from './GlowCard';
import Planet3D from './Planet3D';
import type { DailyHoroscopeData } from '@/lib/horoscope';

function verdictColor(d: string): string {
  if (d === 'up') return 'text-teal-400';
  if (d === 'warning') return 'text-mystic-gold';
  return 'text-white/35';
}

function verdictArrow(d: string): string {
  if (d === 'up') return '↑';
  if (d === 'warning') return '⚠';
  return '→';
}

interface Props {
  horoscopeText: string | null;
  horoscopeData: DailyHoroscopeData | null;
  isRevealed: boolean;
  onReveal: () => void;
  hasCheckin: boolean;
}

export default function HoroscopeRevealCard({
  horoscopeText,
  horoscopeData,
  isRevealed,
  onReveal,
  hasCheckin,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [sparkleActive, setSparkleActive] = useState(false);
  const [revealing, setRevealing] = useState(false);

  function handleReveal() {
    if (!hasCheckin || isRevealed || revealing) return;
    setRevealing(true);
    setSparkleActive(true);
    setTimeout(() => {
      onReveal();
      setRevealing(false);
    }, shouldReduceMotion ? 0 : 900);
    setTimeout(() => setSparkleActive(false), 3500);
  }

  if (!hasCheckin) {
    return (
      <GlowCard glowColor="purple" className="p-5 text-center">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-2">
          OROSCOPO
        </p>
        <p className="text-white/65 font-body text-sm">
          Fai il check-in dell&apos;umore prima di accedere al tuo oroscopo giornaliero
        </p>
      </GlowCard>
    );
  }

  const planet = horoscopeData?.planet;

  // Revealed card
  if (isRevealed && horoscopeText && horoscopeData) {
    const { prediction, outcomes } = horoscopeData;
    const chips = [
      { icon: '💑', label: 'Amore',   verdict: outcomes.amore   },
      { icon: '💼', label: 'Lavoro',  verdict: outcomes.lavoro  },
      { icon: '⚡',  label: 'Energia', verdict: outcomes.energia },
    ];

    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <GlowCard
          glowColor="gold"
          heroSlot={
            planet ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0f2e] via-[#080a1e] to-[#080614]">
                {/* Stars */}
                <div className="absolute w-0.5 h-0.5 rounded-full bg-white/30 top-4 left-10" />
                <div className="absolute w-1 h-1 rounded-full bg-white/20 top-6 right-14" />
                <div className="absolute w-0.5 h-0.5 rounded-full bg-yellow-200/20 top-3 right-1/3" />
                <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 bottom-5 left-20" />

                {/* Orbital ring */}
                <motion.div
                  className="absolute rounded-full border border-white/8"
                  style={{ width: '84px', height: '84px' }}
                  animate={shouldReduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-mystic-gold/50 -top-0.5 left-1/2 -translate-x-1/2" />
                </motion.div>

                {/* Planet */}
                <Planet3D planet={planet} size={56} />

                {/* Planet label at bottom */}
                <div className="absolute bottom-3 text-center">
                  <p
                    className="font-display font-bold text-[10px] tracking-widest uppercase"
                    style={{ color: planet.color }}
                  >
                    {planet.name}
                  </p>
                  <p className="text-white/30 text-[9px] font-body">{planet.meaning}</p>
                </div>

                {/* Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #080614 85%)' }}
                />
              </div>
            ) : undefined
          }
          heroHeight="h-36"
          className="p-5"
          animate={false}
        >
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-2">
            IL TUO OROSCOPO
          </p>

          {/* Prediction headline */}
          <p
            className="font-display text-mystic-gold text-[15px] font-semibold mb-3 leading-snug"
            style={{ textShadow: '0 0 14px rgba(245,158,11,0.35)' }}
          >
            ✦ {prediction}
          </p>

          {/* Body text */}
          <p className="text-white/75 font-body text-sm leading-relaxed whitespace-pre-line mb-4">
            {horoscopeText}
          </p>

          {/* Outcome chips */}
          <div className="border-t border-white/8 pt-3 grid grid-cols-3 gap-2">
            {chips.map(({ icon, label, verdict }) => (
              <div
                key={label}
                className="rounded-xl border border-white/8 bg-white/4 p-2.5 text-center"
              >
                <div className="text-base mb-0.5">{icon}</div>
                <div className="text-white/35 font-body text-[10px] mb-0.5 tracking-wide">{label}</div>
                <div className={`font-body text-[11px] font-semibold flex items-center justify-center gap-0.5 ${verdictColor(verdict.direction)}`}>
                  <span>{verdictArrow(verdict.direction)}</span>
                  <span>{verdict.label}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/20 text-xs font-body mt-4 text-center">
            Torna domani per la prossima lettura
          </p>
        </GlowCard>
      </motion.div>
    );
  }

  // Locked / revealing card
  return (
    <div className="relative">
      <motion.div
        className="rounded-2xl border border-mystic-gold/25 p-5 text-center relative overflow-hidden"
        style={{
          background: 'rgba(13,10,26,0.8)',
          boxShadow: revealing
            ? '0 0 50px rgba(245,158,11,0.3)'
            : '0 0 20px rgba(245,158,11,0.08)',
        }}
      >
        <SparkleField active={sparkleActive} color="#f59e0b" />

        <AnimatePresence mode="wait">
          {!revealing ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              {/* Cosmic orb instead of emoji for consistency */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #fbbf24, #d97706 60%, #7c3aed)',
                    boxShadow: '0 0 24px rgba(245,158,11,0.35), 0 0 48px rgba(124,58,237,0.15)',
                  }}
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-2">
                OROSCOPO DI OGGI
              </p>
              <h3 className="font-display font-semibold text-white text-xl mb-2">
                Il tuo oroscopo ti aspetta
              </h3>
              <p className="text-white/45 font-body text-sm mb-5">
                Le stelle hanno preparato un messaggio speciale per te
              </p>
              <button
                onClick={handleReveal}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-mystic-gold/80 to-mystic-gold font-semibold text-black text-sm font-body transition-all duration-200 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95"
              >
                Scopri il tuo oroscopo di oggi
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center gap-4 py-6"
            >
              {planet ? (
                <motion.div
                  initial={{ scale: 0.05, opacity: 0 }}
                  animate={{ scale: [0.05, 1.3, 1.0], opacity: [0, 1, 1] }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.75, times: [0, 0.62, 1], ease: 'easeOut' }}
                >
                  <Planet3D planet={planet} size={80} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full"
                  style={{ background: 'radial-gradient(circle at 35% 35%, #fbbf24, #d97706)' }}
                />
              )}

              {planet && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
                >
                  <p
                    className="font-display font-bold tracking-widest text-sm uppercase"
                    style={{ color: planet.color }}
                  >
                    {planet.name}
                  </p>
                  <p className="text-white/35 text-xs font-body mt-0.5">{planet.meaning}</p>
                </motion.div>
              )}

              <motion.p
                className="text-mystic-gold font-display text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.6 }}
              >
                Le stelle si allineano...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
