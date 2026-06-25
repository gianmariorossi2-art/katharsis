import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import type { ZodiacSign, Mood } from '@/types';
import GlowCard from '@/components/GlowCard';
import { LEVELS, getLevelInfo, getProgressPercent } from '@/lib/gamification';

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine',
  'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci',
];

const MOOD_EMOJIS: Record<Mood, string> = {
  energico: '😤',
  riflessivo: '🌙',
  romantico: '💖',
  ansioso: '😰',
  curioso: '🔍',
  malinconico: '😔',
};

const LANGUAGES = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

function ProfileHeroVisual({ initial }: { initial: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0a2e 0%, #041f1e 50%, #080614 100%)' }}
    >
      {/* Constellation dots */}
      <div className="absolute w-0.5 h-0.5 rounded-full bg-teal-400/35 top-4 left-12" />
      <div className="absolute w-1 h-1 rounded-full bg-white/15 top-6 right-16" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-400/25 bottom-6 left-16" />
      <div className="absolute w-1 h-1 rounded-full bg-teal-400/20 bottom-4 right-12" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 top-3 right-1/3" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-teal-300/25 bottom-3 left-1/3" />

      {/* Faint orbit ring */}
      <div
        className="absolute rounded-full border border-teal-500/10"
        style={{ width: '100px', height: '100px' }}
      />

      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white font-display relative z-10"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #2dd4bf)',
          boxShadow: '0 0 28px rgba(45,212,191,0.3), 0 0 56px rgba(124,58,237,0.15)',
        }}
      >
        {initial}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #080614 80%)' }}
      />
    </div>
  );
}

export default function Profile() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile, checkins, updateProfile } = useApp();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile?.name || '');
  const [currentLang, setCurrentLang] = useState(i18n.language.split('-')[0] || 'it');

  if (!userProfile) return null;

  const levelInfo = getLevelInfo(userProfile.xp);
  const progress = getProgressPercent(userProfile.xp);
  const xpToNext = levelInfo.maxXp === Infinity ? 0 : levelInfo.maxXp - userProfile.xp;
  const nextLevel = LEVELS.find((l) => l.level === levelInfo.level + 1);

  function handleSaveName() {
    if (nameInput.trim()) updateProfile({ name: nameInput.trim() });
    setEditingName(false);
  }

  function handleSignChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateProfile({ zodiac_sign: e.target.value as ZodiacSign });
  }

  async function handleLanguageChange(code: string) {
    setCurrentLang(code);
    await i18n.changeLanguage(code);
    updateProfile({ language: code });
  }

  const sortedCheckins = [...checkins].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
          KATHARSIS
        </p>
        <h1 className="font-display font-light text-[#f0eeff] text-2xl">
          Il tuo profilo
        </h1>
      </motion.div>

      {/* Avatar & identity — hero card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <GlowCard
          glowColor="teal"
          heroSlot={<ProfileHeroVisual initial={userProfile.name.charAt(0).toUpperCase()} />}
          heroHeight="h-36"
          className="p-5"
          animate={false}
        >
          {editingName ? (
            <div className="flex gap-2 mb-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="flex-1 bg-surface-2 border border-white/10 rounded-full px-3 py-1.5 text-white text-sm font-body focus:outline-none focus:border-teal-500/50"
                autoFocus
                maxLength={30}
              />
              <button
                onClick={handleSaveName}
                className="text-teal-400 text-xs font-body font-semibold px-3 py-1.5 rounded-full border border-teal-500/30 hover:bg-teal-500/10 transition-colors"
              >
                Salva
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1">
              <p className="font-display font-light text-[#f0eeff] text-2xl truncate">
                {userProfile.name}
              </p>
              <button
                onClick={() => { setNameInput(userProfile.name); setEditingName(true); }}
                className="text-white/25 hover:text-white/55 transition-colors text-xs"
                aria-label="Modifica nome"
              >
                ✏️
              </button>
            </div>
          )}
          <p className="font-label text-xs tracking-wide text-[#9b93c4] mb-4">
            {userProfile.zodiac_sign} · Livello {levelInfo.level} — {levelInfo.title}
          </p>

          <div>
            <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-teal-400/70 mb-1.5 block">
              Segno zodiacale
            </label>
            <select
              value={userProfile.zodiac_sign}
              onChange={handleSignChange}
              className="w-full bg-surface-2/60 border border-white/8 rounded-xl px-3 py-2 text-white text-sm font-body focus:outline-none focus:border-teal-500/40 appearance-none transition-colors"
            >
              {ZODIAC_SIGNS.map((sign) => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>
        </GlowCard>
      </motion.div>

      {/* Level progress */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <GlowCard glowColor="gold" className="p-5" animate={false}>
          <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
            PROGRESSIONE
          </p>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-white text-base">
              Livello {levelInfo.level} — {levelInfo.title}
            </h3>
            <span
              className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${levelInfo.color}22`,
                color: levelInfo.color,
                border: `1px solid ${levelInfo.color}44`,
              }}
            >
              {userProfile.xp} XP
            </span>
          </div>

          <div className="h-1.5 bg-[#13112a] rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
          </div>

          {levelInfo.maxXp !== Infinity && nextLevel && (
            <p className="text-white/35 font-body text-xs">
              {xpToNext} XP al livello successivo — {nextLevel.title}
            </p>
          )}
          {levelInfo.maxXp === Infinity && (
            <p className="text-mystic-gold font-body text-xs">
              Hai raggiunto il livello massimo. Sei Asceso/a. ✨
            </p>
          )}
        </GlowCard>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <GlowCard className="p-5" animate={false}>
          <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
            {t('profile.statsLabel')}
          </p>
          <h3 className="font-display font-semibold text-white text-base mb-4">
            Le tue statistiche
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Serie record', value: `${userProfile.record_streak}`, icon: '🔥' },
              { label: 'Gemme totali', value: `${userProfile.gems}`, icon: '◆' },
              { label: 'Serie attuale', value: `${userProfile.current_streak}`, icon: '🔥' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="text-center bg-[#13112a] rounded-xl p-3 border border-[rgba(139,92,246,0.15)]">
                <p className="font-display text-2xl text-[#d4a843]">{value} {icon}</p>
                <p className="font-label text-[10px] text-[#9b93c4] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      {/* Language selector */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mb-4"
      >
        <GlowCard className="p-5" animate={false}>
          <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
            {t('profile.languageLabel')}
          </p>
          <h3 className="font-display font-semibold text-white text-base mb-4">
            {t('profile.language')}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {LANGUAGES.map(({ code, label, flag }) => {
              const isSelected = currentLang === code;
              return (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200 text-center"
                  style={{
                    background: isSelected ? 'rgba(124,58,237,0.2)' : 'rgba(19,17,42,0.8)',
                    border: isSelected ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(139,92,246,0.1)',
                    boxShadow: isSelected ? '0 0 12px rgba(124,58,237,0.2)' : 'none',
                  }}
                >
                  <span className="text-lg leading-none">{flag}</span>
                  <span
                    className="font-label text-[8px] tracking-wide leading-tight"
                    style={{ color: isSelected ? '#a78bfa' : '#4a4468' }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </GlowCard>
      </motion.div>

      {/* Subscription */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4"
      >
        {userProfile.subscription_status === 'premium' ? (
          <GlowCard glowColor="teal" className="p-4" animate={false}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #7c3aed)', boxShadow: '0 0 16px rgba(20,184,166,0.3)' }}
              >
                <span className="text-white text-lg">✦</span>
              </div>
              <div>
                <p className="text-[10px] font-label font-semibold tracking-[0.15em] uppercase text-[#a78bfa] mb-0.5">PIANO</p>
                <p className="font-display font-light text-[#a78bfa]">Premium</p>
                <p className="text-white/45 font-body text-xs">Accesso illimitato all&apos;Oracolo</p>
              </div>
            </div>
          </GlowCard>
        ) : (
          <GlowCard className="p-5" animate={false}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-label font-semibold tracking-[0.15em] uppercase text-[#a78bfa] mb-0.5">PIANO</p>
                <p className="font-display font-light text-[#f0eeff]">Gratuito</p>
                <p className="text-white/35 font-body text-xs mt-0.5">1 domanda all&apos;Oracolo al giorno</p>
              </div>
              <span className="text-white/25 font-body text-xs px-2 py-0.5 rounded-full border border-white/8">
                Free
              </span>
            </div>
            <button
              className="w-full py-3 rounded-full text-white font-body font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
              style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #7c3aed 100%)' }}
            >
              Passa a Premium — Sblocca l&apos;Oracolo illimitato
            </button>
          </GlowCard>
        )}
      </motion.div>

      {/* Horoscope history */}
      {sortedCheckins.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <GlowCard className="p-5" animate={false}>
            <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">
              ARCHIVIO
            </p>
            <h3 className="font-display font-semibold text-white text-base mb-4">
              Storico oroscopi
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
              {sortedCheckins.map((checkin) => {
                const moodEmoji = MOOD_EMOJIS[checkin.mood as Mood] || '✨';
                const preview = checkin.horoscope_text.slice(0, 80);
                const dateLabel = new Date(checkin.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'short',
                });
                return (
                  <div
                    key={checkin.id}
                    className="flex gap-3 p-3 rounded-xl bg-surface-2/50 border border-white/5"
                  >
                    <span className="text-xl flex-shrink-0">{moodEmoji}</span>
                    <div className="min-w-0">
                      <p className="text-white/35 font-body text-xs mb-1">{dateLabel}</p>
                      <p className="text-white/65 font-body text-xs leading-relaxed line-clamp-2">
                        {preview}{checkin.horoscope_text.length > 80 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </motion.div>
      )}

      {/* Sign out */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-4"
      >
        <GlowCard className="p-4" animate={false}>
          <button
            className="w-full py-2.5 rounded-full border border-red-500/25 text-red-400/60 font-body text-sm font-medium hover:border-red-500/45 hover:text-red-400/80 transition-colors"
            onClick={() => signOut()}
          >
            {t('profile.signOut')}
          </button>
        </GlowCard>
      </motion.div>
    </div>
  );
}
