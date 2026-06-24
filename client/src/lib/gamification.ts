import type { LevelInfo } from '@/types';

// Level titles progression (10 levels)
export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Neofita', minXp: 0, maxXp: 50, color: '#9ca3af' },
  { level: 2, title: 'Iniziato', minXp: 50, maxXp: 150, color: '#06b6d4' },
  { level: 3, title: 'Sensitivo', minXp: 150, maxXp: 300, color: '#7c3aed' },
  { level: 4, title: 'Visionario', minXp: 300, maxXp: 500, color: '#a855f7' },
  { level: 5, title: 'Mistico', minXp: 500, maxXp: 750, color: '#f59e0b' },
  { level: 6, title: 'Veggente', minXp: 750, maxXp: 1100, color: '#fbbf24' },
  { level: 7, title: 'Astrologo', minXp: 1100, maxXp: 1500, color: '#e040fb' },
  { level: 8, title: 'Profeta', minXp: 1500, maxXp: 2100, color: '#f43f5e' },
  { level: 9, title: 'Oracolo', minXp: 2100, maxXp: 2800, color: '#f97316' },
  { level: 10, title: 'Asceso', minXp: 2800, maxXp: Infinity, color: '#f59e0b' },
];

// XP == Gems for simplicity (documented: single currency system)
export const GEM_REWARDS = {
  DAILY_HOROSCOPE: 10,
  AURA_CHECKIN: 5,
  SHARE_ENERGIES: 5,
  STREAK_MILESTONE: 20, // every 7 days
} as const;

/**
 * Returns the LevelInfo for a given XP amount.
 */
export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Returns the progress percentage within the current level (0-100).
 */
export function getProgressPercent(xp: number): number {
  const info = getLevelInfo(xp);
  if (info.maxXp === Infinity) return 100;
  const range = info.maxXp - info.minXp;
  const progress = xp - info.minXp;
  return Math.min(100, Math.round((progress / range) * 100));
}

/**
 * Returns 20 if the streak is a multiple of 7 (milestone), otherwise 0.
 */
export function getStreakMilestoneBonus(streak: number): number {
  if (streak > 0 && streak % 7 === 0) {
    return GEM_REWARDS.STREAK_MILESTONE;
  }
  return 0;
}

/**
 * Formats gem count as a human-readable string.
 * E.g. 1200 → "1.2K", 500 → "500"
 */
export function formatGems(gems: number): string {
  if (gems >= 1_000_000) {
    return `${(gems / 1_000_000).toFixed(1)}M`;
  }
  if (gems >= 1_000) {
    return `${(gems / 1_000).toFixed(1)}K`;
  }
  return String(gems);
}
