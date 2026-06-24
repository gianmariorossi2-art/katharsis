import { motion, useReducedMotion } from 'framer-motion';

type GlowColor = 'purple' | 'gold' | 'cyan' | 'gem' | 'teal';

interface GlowCardProps {
  children: React.ReactNode;
  heroSlot?: React.ReactNode;
  heroHeight?: string;
  glowColor?: GlowColor;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const GLOW_STYLES: Record<GlowColor, string> = {
  purple: 'hover:shadow-[0_0_24px_rgba(124,58,237,0.5)]',
  gold: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.5)]',
  cyan: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.5)]',
  gem: 'hover:shadow-[0_0_24px_rgba(224,64,251,0.5)]',
  teal: 'hover:shadow-[0_0_24px_rgba(20,184,166,0.5)]',
};

export default function GlowCard({
  children,
  heroSlot,
  heroHeight = 'h-44',
  glowColor,
  className = '',
  onClick,
  animate = true,
}: GlowCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const glowClass = glowColor ? GLOW_STYLES[glowColor] : '';
  const hasHero = !!heroSlot;

  if (hasHero) {
    const inner = (
      <>
        <div className={`relative overflow-hidden ${heroHeight}`}>{heroSlot}</div>
        <div className={className}>{children}</div>
      </>
    );
    const outerClass = `glass-card rounded-2xl overflow-hidden transition-shadow duration-300 ${glowClass}`;

    if (!animate || shouldReduceMotion) {
      return (
        <div className={outerClass} onClick={onClick} role={onClick ? 'button' : undefined}
          style={{ cursor: onClick ? 'pointer' : undefined }}>
          {inner}
        </div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={outerClass}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        style={{ cursor: onClick ? 'pointer' : undefined }}
      >
        {inner}
      </motion.div>
    );
  }

  // No hero — original behaviour
  const baseClass = `glass-card rounded-2xl transition-shadow duration-300 ${glowClass} ${className}`;
  const content = (
    <div className={baseClass} onClick={onClick} role={onClick ? 'button' : undefined}
      style={{ cursor: onClick ? 'pointer' : undefined }}>
      {children}
    </div>
  );

  if (!animate || shouldReduceMotion) return content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={baseClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      {children}
    </motion.div>
  );
}
