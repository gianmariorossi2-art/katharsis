import { motion, useReducedMotion } from 'framer-motion';
import type { PlanetInfo } from '@/lib/horoscope';

interface Props {
  planet: PlanetInfo;
  size?: number;
}

interface PlanetStyle {
  surface: string;
  speed: number;
  ring?: boolean;
  ringColor?: string;
  pulse?: boolean;
}

// Surface gradient + rotation speed for each planet.
// Gradients are designed so the moving highlight creates convincing rotation.
const STYLES: { [k: string]: PlanetStyle | undefined } = {
  Mercurio: {
    surface: 'radial-gradient(ellipse at 38% 30%, #c8d0e0 0%, #8a9aaa 45%, #607585 75%, #3a5060 100%)',
    speed: 12,
  },
  Venere: {
    surface: 'radial-gradient(ellipse at 38% 30%, #ffe0a0 0%, #d4a940 45%, #b88820 75%, #705810 100%)',
    speed: 10,
  },
  Marte: {
    surface: 'linear-gradient(170deg, #e86030 0%, #c84020 30%, #a02810 60%, #801808 100%)',
    speed: 8,
  },
  Giove: {
    // Multi-band gradient — horizontal stripes simulate jovian cloud belts
    surface:
      'linear-gradient(180deg, #c88b3a 0%, #e8c49a 13%, #b5651d 26%, #d4a464 39%, #8b4513 52%, #e0aa60 65%, #c06820 78%, #c88b3a 100%)',
    speed: 5,
  },
  Saturno: {
    surface:
      'linear-gradient(180deg, #d4b870 0%, #e8d5a0 20%, #c4a055 40%, #b89040 60%, #a07830 80%, #d4b870 100%)',
    speed: 7,
    ring: true,
    ringColor: '#d4b870',
  },
  Urano: {
    surface: 'radial-gradient(ellipse at 40% 30%, #b8f0ff 0%, #22d3ee 40%, #0891b2 75%, #044a65 100%)',
    speed: 9,
  },
  Nettuno: {
    surface: 'linear-gradient(170deg, #5090f8 0%, #1e40af 32%, #1d4ed8 62%, #1a3580 100%)',
    speed: 11,
  },
  Plutone: {
    surface: 'radial-gradient(ellipse at 36% 28%, #b070ff 0%, #7c3aed 45%, #5b21b6 75%, #2e0a70 100%)',
    speed: 15,
  },
  Luna: {
    surface: 'radial-gradient(ellipse at 38% 30%, #e5e7eb 0%, #b0b8c0 45%, #7a8090 75%, #505860 100%)',
    speed: 20,
  },
  Sole: {
    surface: 'radial-gradient(ellipse at 42% 32%, #fffab0 0%, #fbbf24 26%, #f59e0b 54%, #d97706 78%, #a05010 100%)',
    speed: 4,
    pulse: true,
  },
};

const DEFAULT_STYLE: PlanetStyle = {
  surface: 'radial-gradient(ellipse at 35% 30%, #9ca3af, #4b5563)',
  speed: 10,
};

export default function Planet3D({ planet, size = 80 }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const s = STYLES[planet.name] ?? DEFAULT_STYLE;
  const showRing = s.ring && size >= 56;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>

      {/* Background glow halo */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          top: -(size * 0.4),
          left: -(size * 0.4),
          borderRadius: '50%',
          background: `radial-gradient(circle, ${planet.color}48 0%, transparent 60%)`,
          zIndex: 0,
        }}
      />

      {/* Saturn ring behind the sphere */}
      {showRing && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: size * 2.6,
            height: size * 0.38,
            left: -(size * 0.8),
            top: size * 0.31,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center,
              transparent 26%,
              ${s.ringColor ?? planet.color}88 42%,
              ${s.ringColor ?? planet.color}60 55%,
              ${s.ringColor ?? planet.color}28 66%,
              transparent 74%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Sphere — overflow:hidden clips the surface & highlight */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          zIndex: 2,
          background: s.surface,
          boxShadow: [
            `inset -${size * 0.14}px -${size * 0.13}px ${size * 0.3}px rgba(0,0,0,0.68)`,
            `inset ${size * 0.04}px ${size * 0.04}px ${size * 0.1}px rgba(255,255,255,0.07)`,
          ].join(', '),
        }}
      >
        {/* Moving highlight — travels left→right to simulate rotation */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: size * 0.42,
              height: size * 1.35,
              top: -(size * 0.18),
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 68%)',
            }}
            animate={{ x: [-(size * 0.45), size * 1.1, -(size * 0.45)] }}
            transition={{ duration: s.speed, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Fixed lighting overlay: top-left specular + bottom-right ambient shadow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(circle at 29% 26%, rgba(255,255,255,0.54) 0%, rgba(255,255,255,0.10) 28%, transparent 50%)',
              'radial-gradient(circle at 73% 75%, rgba(0,0,0,0.66) 0%, transparent 46%)',
            ].join(', '),
          }}
        />
      </div>

      {/* Sun pulsing corona (only for Sole) */}
      {s.pulse && !shouldReduceMotion && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: size * 1.7,
            height: size * 1.7,
            top: -(size * 0.35),
            left: -(size * 0.35),
            borderRadius: '50%',
            background: `radial-gradient(circle, ${planet.color}80 0%, transparent 58%)`,
            zIndex: 0,
          }}
          animate={{ opacity: [0.35, 1.0, 0.35], scale: [0.92, 1.18, 0.92] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
