import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-purple': {
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
          light: '#a855f7',
          glow: 'rgba(124,58,237,0.4)',
        },
        'mystic-gold': {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24',
          glow: 'rgba(245,158,11,0.4)',
        },
        'energy-cyan': {
          DEFAULT: '#06b6d4',
          dark: '#0891b2',
          light: '#22d3ee',
          glow: 'rgba(6,182,212,0.4)',
        },
        'gem-pink': {
          DEFAULT: '#e040fb',
          glow: 'rgba(224,64,251,0.4)',
        },
        background: '#0a0612',
        surface: '#0d0a1a',
        'surface-2': '#13102b',
        'border-subtle': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'streak-pop': 'streakPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        glowPulse: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%,100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        streakPop: {
          '0%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
