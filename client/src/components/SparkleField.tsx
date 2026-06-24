import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import SparkleParticle from './SparkleParticle';

interface SparkleFieldProps {
  active: boolean;
  color?: string;
}

const PARTICLE_COUNT = 14;

export default function SparkleField({ active, color = '#f59e0b' }: SparkleFieldProps) {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: (i / PARTICLE_COUNT) * 1.2,
      color: i % 3 === 0 ? '#e040fb' : i % 3 === 1 ? color : '#fbbf24',
    }));
  }, [color]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <AnimatePresence>
        {active &&
          particles.map((p) => (
            <SparkleParticle
              key={p.id}
              x={p.x}
              y={p.y}
              delay={p.delay}
              color={p.color}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}
