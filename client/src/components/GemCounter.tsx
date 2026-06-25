import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { formatGems } from '@/lib/gamification';

interface GemCounterProps {
  count: number;
  animate?: boolean;
}

export default function GemCounter({ count, animate = true }: GemCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const prevCount = useRef(count);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (count !== prevCount.current && animate && !shouldReduceMotion) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 600);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count, animate, shouldReduceMotion]);

  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(212,168,67,0.25)]"
      style={{ background: 'rgba(212,168,67,0.12)' }}
      animate={pop && !shouldReduceMotion ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <span className="text-[#d4a843] text-base leading-none" aria-hidden="true">
        ◆
      </span>
      <span className="text-[#d4a843] font-semibold text-sm font-body">
        {formatGems(count)}
      </span>
    </motion.div>
  );
}

interface GemToastProps {
  amount: number;
  onDone: () => void;
}

export function GemToast({ amount, onDone }: GemToastProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence onExitComplete={onDone}>
      <motion.div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full bg-gem-pink/90 text-white text-sm font-semibold shadow-lg pointer-events-none"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={() => {
          setTimeout(onDone, 1800);
        }}
      >
        <span>+{amount} ◆ gemme</span>
      </motion.div>
    </AnimatePresence>
  );
}
