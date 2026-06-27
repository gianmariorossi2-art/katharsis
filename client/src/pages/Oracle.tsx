import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import type { OracleMessage } from '@/types';
import { getOracleResponse } from '@/lib/oracle';
import GlowCard from '@/components/GlowCard';
import { track } from '@/lib/analytics';

const FREE_LIMIT = 1;
const SESSION_KEY = 'katharsis_oracle_session';

const DOMAINS = [
  { id: 'GUIDA_GENERALE', label: 'Guida', icon: '✦' },
  { id: 'AMORE',          label: 'Amore',      icon: '💫' },
  { id: 'CARRIERA',       label: 'Carriera',   icon: '⚡' },
  { id: 'DENARO',         label: 'Denaro',     icon: '◈' },
  { id: 'RELAZIONI',      label: 'Relazioni',  icon: '🌙' },
  { id: 'DECISIONE',      label: 'Decisione',  icon: '⚖️' },
  { id: 'SALUTE',         label: 'Salute',     icon: '🌿' },
  { id: 'CREATIVITA',     label: 'Creatività', icon: '✧' },
  { id: 'SPIRITUALITA',   label: 'Spirito',    icon: '🌌' },
  { id: 'ENERGIA',        label: 'Energia',    icon: '☀️' },
] as const;

// Section titles produced by the AI — rendered with accent styling
const SECTION_TITLES = [
  'SNAPSHOT COSMICO',
  'IL TUO MOMENTO',
  'RISONANZA EMOTIVA',
  'GUIDA OPERATIVA',
  'MAPPA LUNARE',
  'CORRENTI PLANETARIE',
  'ARCHIVIO NATALE',
  'SIMBOLO & RITUALE',
  'TRASMISSIONE FINALE',
];

function OracleText({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (SECTION_TITLES.includes(line.trim().toUpperCase())) {
          return (
            <p key={i} className="text-[9px] font-label font-bold tracking-[0.22em] uppercase text-[#a78bfa] pt-2 first:pt-0">
              {line.trim()}
            </p>
          );
        }
        if (!line.trim()) return null;
        return (
          <p key={i} className="text-[#f0eeff] font-body text-[14px] leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

const INITIAL_MESSAGE: OracleMessage = {
  id: 'oracle-intro',
  role: 'oracle',
  content: 'Benvenuto/a. Le stelle mi hanno già parlato di te... Cosa vuoi sapere?',
  timestamp: new Date().toISOString(),
};

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-1.5 h-1.5 bg-[#a78bfa]/60 rounded-full inline-block"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </span>
  );
}

function OracleAvatar({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <div className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed, #2e0a70)',
          animation: reducedMotion ? 'none' : 'planet-breathe 3s ease-in-out infinite',
        }}
      >
        <span className="text-white/40 text-xs">✦</span>
      </div>
      <motion.div className="absolute inset-0 rounded-full border border-[#a78bfa]/40"
        animate={reducedMotion ? {} : { scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function Oracle() {
  const shouldReduceMotion = useReducedMotion();
  const { i18n } = useTranslation();
  const { userProfile, oracleMessagesCount, addOracleMessage } = useApp();

  const [messages, setMessages] = useState<OracleMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [paywallDismissed, setPaywallDismissed] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('GUIDA_GENERALE');
  const [prevTheme, setPrevTheme] = useState<string | null>(null);
  const [sessionCount] = useState<number>(() => {
    const n = parseInt(localStorage.getItem(SESSION_KEY) || '0', 10) + 1;
    localStorage.setItem(SESSION_KEY, String(n));
    return n;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const domainScrollRef = useRef<HTMLDivElement>(null);

  const isPremium = userProfile?.subscription_status === 'premium';
  const hasReachedLimit = !isPremium && oracleMessagesCount >= FREE_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  }, [messages, isThinking, shouldReduceMotion]);

  async function handleSend() {
    const question = inputValue.trim();
    if (!question || isThinking || hasReachedLimit) return;

    const userMessage: OracleMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);
    addOracleMessage();
    track('oracle_question_asked', { domain: selectedDomain, question_length: question.length });

    try {
      const response = await getOracleResponse({
        question,
        zodiacSign: userProfile?.zodiac_sign || 'Leone',
        domain: selectedDomain,
        userTier: isPremium ? 'PREMIUM' : 'FREE',
        language: i18n.language?.split('-')[0] || 'it',
        returnUser: sessionCount > 1,
        prevTheme,
        sessionCount,
      });

      const oracleMessage: OracleMessage = {
        id: `oracle-${Date.now()}`,
        role: 'oracle',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, oracleMessage]);
      setPrevTheme(selectedDomain);
    } finally {
      setIsThinking(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const activeDomain = DOMAINS.find((d) => d.id === selectedDomain);

  return (
    <div className="flex flex-col h-screen pb-16">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-[rgba(139,92,246,0.15)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <OracleAvatar reducedMotion={!!shouldReduceMotion} />
          <div>
            <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-0.5">KATHARSIS</p>
            <h1 className="font-display font-light text-[#f0eeff] text-2xl leading-tight">L&apos;Oracolo</h1>
            <p className="font-label text-[9px] tracking-[0.2em] text-[#4a4468] uppercase">VOCE DELLE STELLE</p>
          </div>
        </div>
      </div>

      {/* Domain selector */}
      <div className="flex-shrink-0 border-b border-[rgba(139,92,246,0.1)]" style={{ background: 'rgba(13,11,30,0.7)' }}>
        <div
          ref={domainScrollRef}
          className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold font-label tracking-wide transition-all"
              style={selectedDomain === d.id
                ? { background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.5)', color: '#a78bfa' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }
              }
            >
              <span className="text-xs">{d.icon}</span>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Free limit banner */}
      {!isPremium && (
        <div className="flex-shrink-0 px-4 py-1.5 bg-[rgba(124,58,237,0.06)] border-b border-[rgba(139,92,246,0.1)]">
          <p className="text-center text-[#9b93c4] font-label text-[11px]">
            {hasReachedLimit
              ? 'Hai esaurito la tua lettura gratuita di oggi'
              : `${FREE_LIMIT - oracleMessagesCount} lettura gratuita disponibile oggi`}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        <div className="max-w-md mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div key={msg.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {msg.role === 'oracle' && (
                  <div className="w-6 h-6 flex-shrink-0 mt-1 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed)', boxShadow: '0 0 8px rgba(167,139,250,0.3)' }}
                  >
                    <span className="text-white/50 text-[8px]">✦</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3.5 font-body text-sm leading-relaxed ${msg.role === 'user' ? 'text-[#9b93c4] text-sm' : ''}`}
                  style={msg.role === 'user'
                    ? { background: 'rgba(19,17,42,0.8)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px 16px 0 16px' }
                    : { background: 'rgba(124,58,237,0.07)', borderLeft: '2px solid #a78bfa', borderRadius: '0 16px 16px 0', paddingTop: '16px', paddingBottom: '16px' }
                  }
                >
                  {msg.role === 'oracle'
                    ? <OracleText content={msg.content} />
                    : msg.content
                  }
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div key="thinking"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start gap-2"
              >
                <div className="w-6 h-6 flex-shrink-0 mt-1 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed)' }}
                >
                  <span className="text-white/50 text-[8px]">✦</span>
                </div>
                <div className="px-4 py-3" style={{ background: 'rgba(124,58,237,0.07)', borderLeft: '2px solid #a78bfa', borderRadius: '0 16px 16px 0' }}>
                  <p className="text-[10px] text-[#a78bfa] font-label tracking-widest uppercase mb-1.5">
                    {activeDomain?.label} · lettura in corso
                  </p>
                  <ThinkingDots />
                </div>
              </motion.div>
            )}

            {hasReachedLimit && !paywallDismissed && (
              <motion.div key="paywall"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2"
              >
                <GlowCard glowColor="teal" className="p-5 text-center" animate={false}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #7c3aed)', boxShadow: '0 0 24px rgba(45,212,191,0.3)' }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30" />
                  </div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">PREMIUM</p>
                  <h3 className="font-display font-bold text-white text-lg mb-1">Sblocca l&apos;Oracolo illimitato</h3>
                  <p className="text-white/50 font-body text-sm mb-4">
                    Letture complete a 9 livelli, analisi dei transiti planetari, accesso illimitato ogni giorno
                  </p>
                  <button
                    onClick={() => track('oracle_premium_clicked')}
                    className="w-full py-3 rounded-full font-semibold text-white text-sm font-body mb-3 hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
                  >
                    Diventa Premium
                  </button>
                  <button
                    onClick={() => setPaywallDismissed(true)}
                    className="text-white/30 font-body text-xs hover:text-white/50 transition-colors"
                  >
                    Non ora
                  </button>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[rgba(139,92,246,0.15)]"
        style={{ background: 'rgba(13,11,30,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasReachedLimit
              ? 'Lettura gratuita esaurita...'
              : `${activeDomain?.icon} ${activeDomain?.label} — chiedi alle stelle...`
            }
            disabled={hasReachedLimit || isThinking}
            className="flex-1 bg-[rgba(19,17,42,0.8)] border border-[rgba(139,92,246,0.15)] rounded-full px-5 py-2.5 text-[#f0eeff] text-sm font-body placeholder-[#4a4468] focus:outline-none focus:border-[#a78bfa] disabled:opacity-40 transition-colors italic"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking || hasReachedLimit}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 disabled:opacity-30 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
            aria-label="Invia domanda"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
