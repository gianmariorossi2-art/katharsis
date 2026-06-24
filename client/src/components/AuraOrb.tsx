import { useReducedMotion } from 'framer-motion';
import type { AuraData } from '@/types';

interface AuraOrbProps {
  aura: AuraData;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { outer: 120, inner: 96 },
  md: { outer: 160, inner: 128 },
  lg: { outer: 200, inner: 160 },
};

export default function AuraOrb({ aura, size = 'md' }: AuraOrbProps) {
  const shouldReduceMotion = useReducedMotion();
  const dims = SIZE_MAP[size];

  return (
    <div
      className="relative flex items-center justify-center mx-auto"
      style={{ width: dims.outer, height: dims.outer }}
    >
      {/* Outer spinning ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed opacity-40"
        style={{
          borderColor: aura.color,
          animation: shouldReduceMotion ? 'none' : 'spin 8s linear infinite',
        }}
      />

      {/* Middle glow ring */}
      <div
        className="absolute rounded-full opacity-20"
        style={{
          width: dims.outer - 8,
          height: dims.outer - 8,
          backgroundColor: aura.color,
          filter: 'blur(16px)',
        }}
      />

      {/* Core orb */}
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: dims.inner,
          height: dims.inner,
          background: `radial-gradient(circle at 35% 35%, ${aura.color}cc, ${aura.color}66 50%, ${aura.color}22 100%)`,
          boxShadow: `0 0 ${dims.inner / 2}px ${aura.color}66, 0 0 ${dims.inner}px ${aura.color}33`,
          animation: shouldReduceMotion ? 'none' : 'glowPulse 2s ease-in-out infinite',
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute rounded-full opacity-60"
          style={{
            width: dims.inner * 0.35,
            height: dims.inner * 0.35,
            top: '20%',
            left: '22%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Intensity indicator dots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        const isActive = (i / 8) * 100 < aura.intensity;
        return (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: aura.color,
              opacity: isActive ? 0.8 : 0.15,
              transform: `rotate(${angle}deg) translateY(-${dims.outer / 2 + 6}px)`,
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              marginTop: -3,
              marginLeft: -3,
            }}
          />
        );
      })}
    </div>
  );
}
