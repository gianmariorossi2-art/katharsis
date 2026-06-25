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

const GLOW_SHADOW: Record<GlowColor, string> = {
  purple: '0 0 40px rgba(124,58,237,0.4)',
  gold:   '0 0 30px rgba(212,168,67,0.3)',
  cyan:   '0 0 24px rgba(6,182,212,0.4)',
  gem:    '0 0 24px rgba(224,64,251,0.4)',
  teal:   '0 0 30px rgba(45,212,191,0.25)',
};

const BASE_CARD_STYLE: React.CSSProperties = {
  background: 'rgba(13,11,30,0.95)',
  border: '1px solid rgba(139,92,246,0.15)',
  boxShadow: '0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
  borderRadius: '20px',
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
  const glowStyle: React.CSSProperties = glowColor
    ? { ...BASE_CARD_STYLE, boxShadow: `${GLOW_SHADOW[glowColor]}, inset 0 1px 0 rgba(255,255,255,0.04)` }
    : BASE_CARD_STYLE;
  const hasHero = !!heroSlot;

  if (hasHero) {
    const inner = (
      <>
        <div className={`relative overflow-hidden ${heroHeight}`}>{heroSlot}</div>
        <div className={className}>{children}</div>
      </>
    );
    const outerClass = `overflow-hidden transition-shadow duration-300`;

    if (!animate || shouldReduceMotion) {
      return (
        <div className={outerClass} style={glowStyle} onClick={onClick} role={onClick ? 'button' : undefined}
          >
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
        style={glowStyle}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        {inner}
      </motion.div>
    );
  }

  // No hero — original behaviour
  const baseClass = `transition-shadow duration-300 ${className}`;
  const content = (
    <div className={baseClass} style={glowStyle} onClick={onClick} role={onClick ? 'button' : undefined}
      >
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
      style={glowStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </motion.div>
  );
}
