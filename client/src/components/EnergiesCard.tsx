import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import GlowCard from './GlowCard';

interface Energies {
  envy: string;
  power: string;
  warning: string;
}

interface EnergiesCardProps {
  energies: Energies;
}

export default function EnergiesCard({ energies }: EnergiesCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = `✨ Le mie energie di oggi su Katharsis:\n\n👁️ Ti invidiano per: ${energies.envy}\n⚡ La tua energia: ${energies.power}\n⚠️ Attento/a a: ${energies.warning}\n\n— Katharsis, il tuo oracolo personale`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const items = [
    { icon: '👁️', label: 'Ti invidiano per', text: energies.envy, color: 'text-gem-pink' },
    { icon: '⚡', label: 'La tua energia', text: energies.power, color: 'text-mystic-gold' },
    { icon: '⚠️', label: 'Attento/a a', text: energies.warning, color: 'text-energy-cyan' },
  ];

  return (
    <GlowCard glowColor="cyan" className="p-5" animate={!shouldReduceMotion}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-white text-base">
          Energie di oggi
        </h3>
        <button
          onClick={handleShare}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-energy-cyan/10 border border-energy-cyan/20 text-energy-cyan text-xs font-body font-medium transition-colors hover:bg-energy-cyan/20"
        >
          <span>Condividi</span>
          <AnimatePresence>
            {copied && (
              <motion.span
                key="copied"
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-energy-cyan text-black text-xs px-2 py-1 rounded-md whitespace-nowrap font-semibold"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
              >
                Copiato! ✨
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="space-y-3">
        {items.map(({ icon, label, text, color }) => (
          <div key={label} className="flex gap-3">
            <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
            <div>
              <p className={`text-xs font-semibold font-body ${color} mb-0.5`}>{label}</p>
              <p className="text-white/70 text-sm font-body leading-snug">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}
