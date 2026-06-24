import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserProfile, DailyCheckin, Mood } from '@/types';
import { generateDailyHoroscope } from '@/lib/horoscope';
import { GEM_REWARDS, getStreakMilestoneBonus, getLevelInfo } from '@/lib/gamification';

// ─── Mock data ────────────────────────────────────────────────────────────────

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const MOCK_USER: UserProfile = {
  id: 'mock-user-id',
  name: 'Stella',
  zodiac_sign: 'Leone',
  level: 3,
  xp: 215,
  gems: 142,
  current_streak: 5,
  record_streak: 12,
  subscription_status: 'free',
  created_at: '2024-01-15T10:00:00Z',
};

const MOCK_MOODS: Mood[] = ['energico', 'riflessivo', 'romantico', 'ansioso', 'curioso', 'malinconico'];

function makeMockCheckins(): DailyCheckin[] {
  const checkins: DailyCheckin[] = [];
  for (let i = 13; i >= 1; i--) {
    const mood = MOCK_MOODS[i % MOCK_MOODS.length];
    const date = daysAgo(i);
    const horoscope = generateDailyHoroscope('Leone', mood, new Date(date));
    checkins.push({
      id: `mock-checkin-${i}`,
      user_id: 'mock-user-id',
      date,
      mood,
      horoscope_text: horoscope,
      opened: true,
      created_at: `${date}T08:00:00Z`,
    });
  }
  return checkins;
}

// ─── Context types ─────────────────────────────────────────────────────────────

interface AppContextValue {
  userProfile: UserProfile | null;
  checkins: DailyCheckin[];
  todayCheckin: DailyCheckin | null;
  oracleMessagesCount: number;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addCheckin: (mood: Mood) => Promise<DailyCheckin>;
  revealHoroscope: () => void;
  addGems: (amount: number) => void;
  addOracleMessage: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER);
  const [checkins, setCheckins] = useState<DailyCheckin[]>(makeMockCheckins());
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [oracleMessagesCount, setOracleMessagesCount] = useState(0);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Recalculate level based on xp
      if (updates.xp !== undefined) {
        const levelInfo = getLevelInfo(updated.xp);
        updated.level = levelInfo.level;
      }
      return updated;
    });
  }, []);

  const addGems = useCallback((amount: number) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      const newGems = prev.gems + amount;
      const newXp = prev.xp + amount;
      const levelInfo = getLevelInfo(newXp);
      return { ...prev, gems: newGems, xp: newXp, level: levelInfo.level };
    });
  }, []);

  const addCheckin = useCallback(
    async (mood: Mood): Promise<DailyCheckin> => {
      const horoscope = generateDailyHoroscope(
        userProfile?.zodiac_sign || 'Leone',
        mood,
        today
      );

      const newCheckin: DailyCheckin = {
        id: `checkin-${Date.now()}`,
        user_id: userProfile?.id || 'mock-user-id',
        date: todayStr,
        mood,
        horoscope_text: horoscope,
        opened: false,
        created_at: new Date().toISOString(),
      };

      setCheckins((prev) => [...prev, newCheckin]);
      setTodayCheckin(newCheckin);

      // Award gems for check-in
      addGems(GEM_REWARDS.AURA_CHECKIN);

      // Update streak
      setUserProfile((prev) => {
        if (!prev) return prev;
        const newStreak = prev.current_streak + 1;
        const milestoneBonus = getStreakMilestoneBonus(newStreak);
        const newGems = prev.gems + GEM_REWARDS.AURA_CHECKIN + milestoneBonus;
        const newXp = prev.xp + GEM_REWARDS.AURA_CHECKIN + milestoneBonus;
        const levelInfo = getLevelInfo(newXp);
        return {
          ...prev,
          current_streak: newStreak,
          record_streak: Math.max(prev.record_streak, newStreak),
          gems: newGems,
          xp: newXp,
          level: levelInfo.level,
        };
      });

      return newCheckin;
    },
    [userProfile, addGems]
  );

  const revealHoroscope = useCallback(() => {
    if (!todayCheckin) return;

    setTodayCheckin((prev) => {
      if (!prev) return prev;
      return { ...prev, opened: true };
    });

    setCheckins((prev) =>
      prev.map((c) => (c.id === todayCheckin.id ? { ...c, opened: true } : c))
    );

    // Award gems for revealing
    addGems(GEM_REWARDS.DAILY_HOROSCOPE);
  }, [todayCheckin, addGems]);

  const addOracleMessage = useCallback(() => {
    setOracleMessagesCount((prev) => prev + 1);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        checkins,
        todayCheckin,
        oracleMessagesCount,
        updateProfile,
        addCheckin,
        revealHoroscope,
        addGems,
        addOracleMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
