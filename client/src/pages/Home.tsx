import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import type { Mood } from '@/types';
import { track } from '@/lib/analytics';
import GemCounter, { GemToast } from '@/components/GemCounter';
import StreakBadge from '@/components/StreakBadge';
import MoodSelector from '@/components/MoodSelector';
import HoroscopeRevealCard from '@/components/HoroscopeRevealCard';
import EnergiesCard from '@/components/EnergiesCard';
import GlowCard from '@/components/GlowCard';
import { generateDailyEnergies, getHoroscopeData } from '@/lib/horoscope';
import { GEM_REWARDS } from '@/lib/gamification';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Buonanotte';
  if (hour < 12) return 'Buongiorno';
  if (hour < 18) return 'Buon pomeriggio';
  return 'Buonasera';
}

function CosmicOrbHero({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0f0a2e] via-[#0a0820] to-[#080614]">
      {/* Star field */}
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 top-4 left-8" />
      <div className="absolute w-1 h-1 rounded-full bg-white/20 top-5 right-12" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-teal-300/30 top-10 left-1/4" />
      <div className="absolute w-1 h-1 rounded-full bg-white/25 bottom-5 left-14" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 bottom-4 right-10" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/35 top-3 right-1/4" />
      <div className="absolute w-1 h-1 rounded-full bg-teal-400/20 bottom-6 right-1/3" />

      {/* Outer slow orbit */}
      <motion.div
        className="absolute rounded-full border border-purple-500/20"
        style={{ width: '112px', height: '112px' }}
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full bg-purple-400/50 -top-1 left-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Teal orbit */}
      <motion.div
        className="absolute rounded-full border border-teal-500/25"
        style={{ width: '72px', height: '72px' }}
        animate={reducedMotion ? {} : { rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-1.5 h-1.5 rounded-full bg-teal-400/70 -top-0.5 left-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full border border-purple-400/15"
        style={{ width: '44px', height: '44px' }}
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Central orb */}
      <motion.div
        className="w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #7c3aed 60%, #5b21b6)',
          animation: reducedMotion ? 'none' : 'planet-breathe 3s ease-in-out infinite',
        }}
        animate={reducedMotion ? {} : { scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #0a0820 80%)' }}
      />
    </div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile, todayCheckin, addCheckin, revealHoroscope } = useApp();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isCheckinLoading, setIsCheckinLoading] = useState(false);
  const [gemToast, setGemToast] = useState<number | null>(null);

  const greeting = getGreeting();
  const name = userProfile?.name || 'Viandante';
  const hasCheckin = !!todayCheckin;
  const isRevealed = todayCheckin?.opened ?? false;

  async function handleCheckin() {
    if (!selectedMood || isCheckinLoading) return;
    setIsCheckinLoading(true);
    try {
      await addCheckin(selectedMood);
      setGemToast(GEM_REWARDS.AURA_CHECKIN);
      track('checkin_completed', { mood: selectedMood, sign: userProfile?.zodiac_sign });
    } finally {
      setIsCheckinLoading(false);
    }
  }

  function handleReveal() {
    revealHoroscope();
    setGemToast(GEM_REWARDS.DAILY_HOROSCOPE);
    track('horoscope_revealed', { sign: userProfile?.zodiac_sign, mood: todayCheckin?.mood });
  }

  const energies =
    todayCheckin && isRevealed
      ? generateDailyEnergies(userProfile?.zodiac_sign || 'Leone', todayCheckin.mood)
      : null;

  const horoscopeData = todayCheckin
    ? getHoroscopeData(userProfile?.zodiac_sign || 'Leone', todayCheckin.mood)
    : null;

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
          {greeting}, {name}
        </h1>
        <p className="font-label text-[#d4a843] text-sm tracking-[0.15em]">
          {new Date().toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>

        <div className="flex items-center gap-2 mt-3">
          {userProfile && <StreakBadge streak={userProfile.current_streak} />}
          {userProfile && <GemCounter count={userProfile.gems} />}
        </div>

      </motion.div>

      {/* Main content */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {!hasCheckin ? (
            <motion.div
              key="checkin"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <GlowCard
                glowColor="teal"
                heroSlot={<CosmicOrbHero reducedMotion={!!shouldReduceMotion} />}
                heroHeight="h-40"
                className="p-5"
                animate={false}
              >
                <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
                  CHECK-IN COSMICO
                </p>
                <h2 className="font-display font-light text-[#f0eeff] text-2xl mb-1">
                  Come ti senti oggi?
                </h2>
                <p className="text-white/50 font-body text-sm mb-4">
                  Il tuo umore guida la lettura cosmica
                </p>
                <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />

                {selectedMood && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <button
                      onClick={handleCheckin}
                      disabled={isCheckinLoading}
                      className="w-full py-3 rounded-full font-semibold text-white text-sm font-body transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #d4a843)' }}
                    >
                      {isCheckinLoading ? 'Le stelle si preparano...' : 'Rivela il tuo oroscopo'}
                    </button>
                  </motion.div>
                )}
              </GlowCard>
            </motion.div>
          ) : (
            <motion.div
              key="horoscope"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <HoroscopeRevealCard
                horoscopeText={todayCheckin.horoscope_text}
                horoscopeData={horoscopeData}
                isRevealed={isRevealed}
                onReveal={handleReveal}
                hasCheckin={hasCheckin}
              />

              {isRevealed && energies && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <EnergiesCard energies={energies} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily tip */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlowCard className="p-4" animate={false}>
            <p className="text-white/30 text-xs font-body text-center">
              App per intrattenimento. Nessuna garanzia scientifica.
            </p>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}
