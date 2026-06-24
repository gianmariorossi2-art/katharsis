import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import type { OracleMessage } from '@/types';
import { getOracleResponse } from '@/lib/oracle';
import GlowCard from '@/components/GlowCard';

const FREE_LIMIT = 1;

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
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-teal-400/60 rounded-full inline-block"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </span>
  );
}

function OracleAvatar({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #0d9488 70%, #042f2e)',
          boxShadow: '0 0 16px rgba(20,184,166,0.45)',
        }}
      >
        <div className="w-4 h-4 rounded-full bg-white/30 backdrop-blur-sm" />
      </div>
      <motion.div
        className="absolute inset-0 rounded-full border border-teal-400/40"
        animate={reducedMotion ? {} : { scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function Oracle() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile, oracleMessagesCount, addOracleMessage } = useApp();
  const [messages, setMessages] = useState<OracleMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [paywallDismissed, setPaywallDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    try {
      const response = await getOracleResponse(question);
      const oracleMessage: OracleMessage = {
        id: `oracle-${Date.now()}`,
        role: 'oracle',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, oracleMessage]);
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

  return (
    <div className="flex flex-col h-screen pb-16">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4 border-b border-white/8">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <OracleAvatar reducedMotion={!!shouldReduceMotion} />
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-0.5">
              KATHARSIS
            </p>
            <h1 className="font-display font-bold text-white text-xl leading-tight">
              L&apos;Oracolo
            </h1>
          </div>
        </div>
      </div>

      {/* Free limit banner */}
      {!isPremium && (
        <div className="flex-shrink-0 px-4 py-2 bg-teal-500/8 border-b border-teal-500/15">
          <p className="text-center text-white/50 font-body text-xs">
            {hasReachedLimit
              ? 'Hai esaurito la tua domanda gratuita di oggi'
              : `${FREE_LIMIT - oracleMessagesCount} domanda gratuita rimanente oggi`}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        <div className="max-w-md mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {msg.role === 'oracle' && (
                  <div className="w-7 h-7 flex-shrink-0 mt-1 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #0d9488)',
                      boxShadow: '0 0 8px rgba(20,184,166,0.3)',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl font-body text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-600/30 border border-teal-500/30 text-white rounded-tr-sm'
                      : 'bg-surface-2 text-white/85 rounded-tl-sm border-l-2 border-teal-500/40'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                key="thinking"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start gap-2"
              >
                <div className="w-7 h-7 flex-shrink-0 mt-1 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #0d9488)' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                </div>
                <div className="bg-surface-2 text-white/60 px-4 py-3 rounded-2xl rounded-tl-sm border-l-2 border-teal-500/40">
                  <ThinkingDots />
                </div>
              </motion.div>
            )}

            {hasReachedLimit && !paywallDismissed && (
              <motion.div
                key="paywall"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2"
              >
                <GlowCard glowColor="teal" className="p-5 text-center" animate={false}>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #7c3aed)',
                      boxShadow: '0 0 24px rgba(45,212,191,0.3)',
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30" />
                  </div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
                    PREMIUM
                  </p>
                  <h3 className="font-display font-bold text-white text-lg mb-1">
                    Sblocca l&apos;Oracolo illimitato
                  </h3>
                  <p className="text-white/50 font-body text-sm mb-4">
                    Con Premium hai accesso illimitato all&apos;Oracolo, letture avanzate e molto altro
                  </p>
                  <button className="w-full py-3 rounded-full bg-teal-500 hover:bg-teal-400 font-semibold text-white text-sm font-body mb-3 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all">
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
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/8 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasReachedLimit ? 'Domanda gratuita esaurita...' : 'Chiedi alle stelle...'}
            disabled={hasReachedLimit || isThinking}
            className="flex-1 bg-surface-2 border border-white/8 rounded-full px-5 py-2.5 text-white text-sm font-body placeholder-white/25 focus:outline-none focus:border-teal-500/50 disabled:opacity-40 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking || hasReachedLimit}
            className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-400 flex items-center justify-center text-white flex-shrink-0 disabled:opacity-30 transition-all hover:shadow-[0_0_14px_rgba(20,184,166,0.4)] active:scale-95"
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
