import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getCurrentMoon, getMoonCalendar, MONTH_NAMES_IT } from '@/lib/moon';
import GlowCard from '@/components/GlowCard';

const DAY_HEADERS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function MoonHeroVisual({
  emoji,
  reducedMotion,
}: {
  emoji: string;
  reducedMotion: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#05031a] via-[#080614] to-[#080614]">
      {/* Star field */}
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/50 top-3 left-8" />
      <div className="absolute w-1 h-1 rounded-full bg-white/30 top-5 right-10" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 top-8 left-1/3" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/40 top-4 right-1/4" />
      <div className="absolute w-1 h-1 rounded-full bg-white/25 bottom-4 left-14" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/35 bottom-5 right-12" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-teal-300/30 bottom-3 left-1/4" />

      {/* Moon glow backdrop */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)' }}
        animate={reducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moon emoji */}
      <div
        className="text-[64px] leading-none select-none relative z-10"
        style={{ filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.6))' }}
      >
        {emoji}
      </div>
    </div>
  );
}

export default function Luna() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile } = useApp();
  const sign = userProfile?.zodiac_sign || 'Leone';

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const moonData = getCurrentMoon(sign);
  const calDays = getMoonCalendar(viewYear, viewMonth, sign);

  // First weekday of the month (0=Sun)
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  // Pad cells before day 1
  const paddingCells = Array.from({ length: firstWeekday });

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
          CICLI LUNARI
        </p>
        <h1 className="font-display font-light text-[#f0eeff] text-2xl mb-1">Luna</h1>
        <p className="text-white/40 font-body text-sm">Il ritmo del cielo, giorno per giorno</p>
      </motion.div>

      {/* Hero — current moon phase */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <GlowCard
          glowColor="purple"
          heroSlot={
            <MoonHeroVisual emoji={moonData.emoji} reducedMotion={!!shouldReduceMotion} />
          }
          heroHeight="h-44"
          className="p-5"
          animate={false}
        >
          <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
            FASE DI OGGI
          </p>
          <h2 className="font-display font-light text-[#f0eeff] text-2xl mb-1">
            {moonData.name}
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf]"
                style={{ width: `${moonData.illumination}%` }}
              />
            </div>
            <span className="text-white/50 font-body text-xs flex-shrink-0">
              {moonData.illumination}% illuminata
            </span>
          </div>
          <p className="text-white/55 font-body text-sm leading-relaxed">
            {moonData.description}
          </p>
        </GlowCard>
      </motion.div>

      {/* Influence card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <GlowCard
          glowColor={moonData.isFavorable ? 'teal' : undefined}
          className="p-4"
          animate={false}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
              style={{
                background: moonData.isFavorable
                  ? 'radial-gradient(circle, #2dd4bf44, #0d948822)'
                  : 'radial-gradient(circle, #7c3aed33, #5b21b622)',
                border: `1px solid ${moonData.isFavorable ? '#2dd4bf40' : '#7c3aed30'}`,
              }}
            >
              {moonData.isFavorable ? '✦' : '○'}
            </div>
            <div>
              <p className="text-[10px] font-label font-semibold tracking-[0.15em] uppercase text-[#a78bfa] mb-0.5">
                {sign} · Influenza lunare
              </p>
              <p className="text-white/65 font-body text-sm leading-relaxed">
                {moonData.influence}
              </p>
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Monthly calendar */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <GlowCard className="p-4" animate={false}>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              ‹
            </button>
            <div className="text-center">
              <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-0.5">
                CALENDARIO
              </p>
              <h3 className="font-display font-light text-[#f0eeff] text-base">
                {MONTH_NAMES_IT[viewMonth]} {viewYear}
              </h3>
            </div>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              ›
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal-400/60" />
              <span className="text-white/35 text-[10px] font-body">Favorevole per {sign}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full border border-white/30" />
              <span className="text-white/35 text-[10px] font-body">Oggi</span>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-[9px] font-semibold text-white/25 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {paddingCells.map((_, i) => <div key={`pad-${i}`} />)}
            {calDays.map((day) => (
              <div
                key={day.day}
                className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
                  day.isToday
                    ? 'border border-white/30 bg-white/5'
                    : day.isFavorable
                    ? 'border border-teal-500/20 bg-teal-500/5'
                    : ''
                }`}
                style={day.isFavorable ? { boxShadow: '0 0 8px rgba(212,168,67,0.2)' } : undefined}
              >
                <span className="text-sm leading-none">{day.emoji}</span>
                <span
                  className={`text-[9px] mt-0.5 font-body ${
                    day.isToday
                      ? 'text-white font-semibold'
                      : day.isFavorable
                      ? 'text-teal-400/70'
                      : 'text-white/30'
                  }`}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}
