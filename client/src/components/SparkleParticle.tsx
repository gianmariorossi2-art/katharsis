import { motion, useReducedMotion } from 'framer-motion';

interface SparkleParticleProps {
  color: string;
  delay: number;
  x: number;
  y: number;
}

export default function SparkleParticle({ color, delay, x, y }: SparkleParticleProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: Math.random() > 0.5 ? 4 : 3,
        height: Math.random() > 0.5 ? 4 : 3,
        backgroundColor: color,
        boxShadow: `0 0 6px 2px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  );
}
