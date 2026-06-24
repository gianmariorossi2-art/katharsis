import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import type { Mood } from '@/types';
import AuraOrb from '@/components/AuraOrb';
import MoodSelector from '@/components/MoodSelector';
import GlowCard from '@/components/GlowCard';
import { calculateAuraFromMoods, getAuraHistory } from '@/lib/aura';

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return DAY_LABELS[d.getDay()];
}

export default function Aura() {
  const shouldReduceMotion = useReducedMotion();
  const { checkins, todayCheckin, addCheckin } = useApp();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const allCheckins = todayCheckin ? [...checkins, todayCheckin] : checkins;
  const recentMoods = allCheckins.slice(-14).map((c) => c.mood as Mood);
  const currentAura = calculateAuraFromMoods(recentMoods);
  const auraHistory = getAuraHistory(allCheckins.slice(-7));
  const last7Checkins = allCheckins.slice(-7);

  async function handleQuickCheckin() {
    if (!selectedMood || isLoading) return;
    setIsLoading(true);
    try {
      await addCheckin(selectedMood);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
          ENERGIA
        </p>
        <h1 className="font-display font-bold text-white text-2xl mb-1">
          La Tua Aura
        </h1>
        <p className="text-white/40 font-body text-sm">
          Il tuo campo energetico personale
        </p>
      </motion.div>

      {/* Aura Orb — hero card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-4"
      >
        <GlowCard
          glowColor="teal"
          heroSlot={
            <div className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `radial-gradient(ellipse at center, ${currentAura.color}18 0%, #0a0820 60%, #080614 100%)`,
              }}
            >
              {/* Star dots */}
              <div className="absolute w-0.5 h-0.5 rounded-full bg-white/30 top-4 left-8" />
              <div className="absolute w-1 h-1 rounded-full bg-white/20 top-5 right-12" />
              <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 bottom-5 left-16" />
              <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 bottom-4 right-10" />
              <AuraOrb aura={currentAura} size="md" />
            </div>
          }
          heroHeight="h-52"
          className="p-5 text-center"
          animate={false}
        >
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
            AURA ATTUALE
          </p>
          <h2
            className="font-display font-bold text-2xl mb-2"
            style={{ color: currentAura.color }}
          >
            {currentAura.label}
          </h2>
          <p className="text-white/55 font-body text-sm leading-relaxed">
            {currentAura.description}
          </p>
        </GlowCard>
      </motion.div>

      {/* Quick checkin if needed */}
      {!todayCheckin && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <GlowCard glowColor="purple" className="p-4" animate={false}>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-2">
              AGGIORNA
            </p>
            <p className="text-white/65 font-body text-sm mb-3">
              Come ti senti oggi? Il tuo umore aggiorna la tua aura.
            </p>
            <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
            {selectedMood && (
              <button
                onClick={handleQuickCheckin}
                disabled={isLoading}
                className="mt-3 w-full py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-body text-sm font-semibold transition-all disabled:opacity-40 hover:shadow-[0_0_16px_rgba(20,184,166,0.4)]"
              >
                {isLoading ? 'Aggiornamento aura...' : 'Aggiorna la tua aura'}
              </button>
            )}
          </GlowCard>
        </motion.div>
      )}

      {/* Aura history — last 7 days */}
      {last7Checkins.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <GlowCard className="p-4" animate={false}>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
              STORIA
            </p>
            <h3 className="font-display font-semibold text-white text-base mb-4">
              Ultimi 7 giorni
            </h3>
            <div className="flex justify-between items-end gap-1">
              {last7Checkins.map((checkin, i) => {
                const aura = auraHistory[auraHistory.length - last7Checkins.length + i];
                return (
                  <div
                    key={checkin.id}
                    className="flex flex-col items-center gap-2 relative"
                    onMouseEnter={() => setTooltipIndex(i)}
                    onMouseLeave={() => setTooltipIndex(null)}
                    onTouchStart={() => setTooltipIndex(i)}
                    onTouchEnd={() => setTimeout(() => setTooltipIndex(null), 1500)}
                  >
                    {tooltipIndex === i && aura && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-2 border border-white/10 px-2 py-1 rounded-lg text-xs font-body whitespace-nowrap z-10"
                        style={{ color: aura.color }}
                      >
                        {aura.label}
                      </div>
                    )}
                    <div
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: aura ? `${aura.color}33` : '#ffffff11',
                        borderColor: aura ? aura.color : '#ffffff22',
                        boxShadow: aura ? `0 0 8px ${aura.color}66` : 'none',
                      }}
                    />
                    <span className="text-white/35 font-body text-[10px]">
                      {getDayLabel(checkin.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </motion.div>
      )}

      {/* Explanation */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <GlowCard className="p-4" animate={false}>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-2">
            COME FUNZIONA
          </p>
          <h3 className="font-display font-semibold text-white text-sm mb-2">
            Come evolve la tua aura
          </h3>
          <p className="text-white/45 font-body text-xs leading-relaxed">
            La tua aura si aggiorna ogni giorno in base al tuo umore. Più check-in fai, più la lettura diventa accurata. Le aure cambiano, si mescolano e si evolvono come te.
          </p>
        </GlowCard>
      </motion.div>
    </div>
  );
}
