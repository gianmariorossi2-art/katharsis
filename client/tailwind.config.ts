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
          DEFAULT: '#d4a843',
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
        background: '#07060f',
        surface: '#0d0b1e',
        'surface-2': '#13112a',
        'border-subtle': 'rgba(139,92,246,0.15)',
        // new cosmic tokens
        'cosmic-void':    '#07060f',
        'cosmic-deep':    '#0d0b1e',
        'cosmic-surface': '#13112a',
        'star-white':     '#f0eeff',
        'star-dim':       '#9b93c4',
        'star-ghost':     '#4a4468',
        'nebula-purple':  '#7c3aed',
        'nebula-violet':  '#a78bfa',
        'nebula-gold':    '#d4a843',
        'nebula-teal':    '#2dd4bf',
        'nebula-rose':    '#e879a0',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        label: ['Cinzel', 'serif'],
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
