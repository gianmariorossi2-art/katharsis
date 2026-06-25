import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ZODIAC_SIGNS = ['Ariete','Toro','Gemelli','Cancro','Leone','Vergine','Bilancia','Scorpione','Sagittario','Capricorno','Acquario','Pesci'];

type Tab = 'login' | 'register';

export default function Auth() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zodiacSign, setZodiacSign] = useState('Leone');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else {
        if (!name.trim()) { setError(t('auth.nameRequired')); setLoading(false); return; }
        const { error } = await signUp(email, password, name.trim(), zodiacSign);
        if (error) setError(error.message);
        else setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--cosmic-void)' }}>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed, #2e0a70)',
            boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)',
          }}
        >
          <span className="text-white/60 text-xl">✦</span>
        </div>
        <p className="font-label text-[10px] tracking-[0.3em] text-[#a78bfa] uppercase mb-1">KATHARSIS</p>
        <h1 className="font-display font-light text-[#f0eeff] text-3xl">{t('auth.title')}</h1>
        <p className="font-body text-[#9b93c4] text-sm mt-1">{t('auth.subtitle')}</p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="w-full max-w-sm"
        style={{
          background: 'rgba(13,11,30,0.95)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '20px',
          boxShadow: '0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: '28px 24px',
        }}
      >
        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden mb-6 bg-[#07060f] border border-[rgba(139,92,246,0.12)]">
          {(['login','register'] as Tab[]).map((t_) => (
            <button
              key={t_}
              onClick={() => { setTab(t_); setError(null); setSuccess(false); }}
              className="flex-1 py-2.5 text-sm font-label tracking-[0.1em] transition-all duration-200"
              style={{
                background: tab === t_ ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: tab === t_ ? '#a78bfa' : '#4a4468',
                borderRadius: tab === t_ ? '10px' : '0',
              }}
            >
              {t_ === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          ))}
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✦</div>
            <p className="font-display text-[#f0eeff] text-xl mb-2">{t('auth.almost')}</p>
            <p className="font-body text-[#9b93c4] text-sm">{t('auth.confirmEmail')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {tab === 'register' && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="font-label text-[9px] tracking-[0.15em] text-[#9b93c4] uppercase block mb-1.5">{t('auth.name')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t('auth.namePlaceholder')}
                      className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.15)] rounded-xl px-4 py-3 text-[#f0eeff] text-sm placeholder-[#4a4468] focus:outline-none focus:border-[#a78bfa] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-label text-[9px] tracking-[0.15em] text-[#9b93c4] uppercase block mb-1.5">{t('auth.sign')}</label>
                    <select
                      value={zodiacSign}
                      onChange={e => setZodiacSign(e.target.value)}
                      className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.15)] rounded-xl px-4 py-3 text-[#f0eeff] text-sm focus:outline-none focus:border-[#a78bfa] transition-colors appearance-none"
                    >
                      {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="font-label text-[9px] tracking-[0.15em] text-[#9b93c4] uppercase block mb-1.5">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="la.tua@email.com"
                required
                className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.15)] rounded-xl px-4 py-3 text-[#f0eeff] text-sm placeholder-[#4a4468] focus:outline-none focus:border-[#a78bfa] transition-colors"
              />
            </div>

            <div>
              <label className="font-label text-[9px] tracking-[0.15em] text-[#9b93c4] uppercase block mb-1.5">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.15)] rounded-xl px-4 py-3 text-[#f0eeff] text-sm placeholder-[#4a4468] focus:outline-none focus:border-[#a78bfa] transition-colors"
              />
            </div>

            {error && (
              <p className="font-body text-xs text-[#e879a0] bg-[rgba(232,121,160,0.08)] border border-[rgba(232,121,160,0.2)] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-label tracking-[0.1em] text-white text-sm transition-all disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #d4a843)' }}
            >
              {loading ? '...' : tab === 'login' ? t('auth.submit_login') : t('auth.submit_register')}
            </button>

            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[rgba(139,92,246,0.15)]" />
              <span className="font-body text-[#4a4468] text-xs">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-[rgba(139,92,246,0.15)]" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-3 rounded-full font-body text-sm text-[#9b93c4] border border-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.4)] hover:text-[#f0eeff] transition-all flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.google')}
            </button>
          </form>
        )}
      </motion.div>

      <p className="font-body text-[#4a4468] text-xs mt-6 text-center max-w-xs">
        {t('auth.privacy')}
      </p>
    </div>
  );
}
