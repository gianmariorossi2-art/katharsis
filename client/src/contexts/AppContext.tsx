import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { UserProfile, DailyCheckin, Mood } from '@/types';
import { generateDailyHoroscope } from '@/lib/horoscope';
import { GEM_REWARDS, getStreakMilestoneBonus, getLevelInfo } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const todayStr = new Date().toISOString().split('T')[0];
const today = new Date();

// Check if Supabase is actually configured (not placeholder)
const SUPABASE_CONFIGURED = !import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') &&
  !!import.meta.env.VITE_SUPABASE_URL;

// ─── Mock fallback (used when not logged in or Supabase not configured) ─────────

const MOCK_USER: UserProfile = {
  id: 'mock-user-id',
  name: 'Viandante',
  zodiac_sign: 'Leone',
  level: 1,
  xp: 0,
  gems: 0,
  current_streak: 0,
  record_streak: 0,
  subscription_status: 'free',
  created_at: new Date().toISOString(),
};

// ─── Context types ──────────────────────────────────────────────────────────────

interface AppContextValue {
  userProfile: UserProfile | null;
  checkins: DailyCheckin[];
  todayCheckin: DailyCheckin | null;
  oracleMessagesCount: number;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addCheckin: (mood: Mood) => Promise<DailyCheckin>;
  revealHoroscope: () => void;
  addGems: (amount: number) => void;
  addOracleMessage: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [oracleMessagesCount, setOracleMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when user changes
  useEffect(() => {
    if (!user || !SUPABASE_CONFIGURED) {
      setUserProfile(MOCK_USER);
      setCheckins([]);
      setTodayCheckin(null);
      setOracleMessagesCount(0);
      setIsLoading(false);
      return;
    }

    async function loadData() {
      setIsLoading(true);
      try {
        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .single();

        if (profile) setUserProfile(profile as UserProfile);

        // Load recent checkins (last 14 days)
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const { data: checkinsData } = await supabase
          .from('daily_checkins')
          .select('*')
          .eq('user_id', user!.id)
          .gte('date', twoWeeksAgo.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (checkinsData) {
          setCheckins(checkinsData as DailyCheckin[]);
          const todayC = checkinsData.find(c => c.date === todayStr);
          setTodayCheckin(todayC as DailyCheckin ?? null);
        }

        // Load today's oracle message count
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const { count } = await supabase
          .from('oracle_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user!.id)
          .gte('created_at', todayStart.toISOString());

        setOracleMessagesCount(count ?? 0);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (updates.xp !== undefined) {
        const levelInfo = getLevelInfo(updated.xp);
        updated.level = levelInfo.level;
      }
      return updated;
    });

    if (user && SUPABASE_CONFIGURED) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  }, [user]);

  const addGems = useCallback((amount: number) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      const newGems = prev.gems + amount;
      const newXp = prev.xp + amount;
      const levelInfo = getLevelInfo(newXp);
      const updated = { ...prev, gems: newGems, xp: newXp, level: levelInfo.level };
      if (user && SUPABASE_CONFIGURED) {
        supabase.from('profiles').update({ gems: newGems, xp: newXp, level: levelInfo.level }).eq('id', user.id);
      }
      return updated;
    });
  }, [user]);

  const addCheckin = useCallback(async (mood: Mood): Promise<DailyCheckin> => {
    const horoscope = generateDailyHoroscope(
      userProfile?.zodiac_sign || 'Leone',
      mood,
      today
    );

    const newCheckin: DailyCheckin = {
      id: `checkin-${Date.now()}`,
      user_id: user?.id || 'mock-user-id',
      date: todayStr,
      mood,
      horoscope_text: horoscope,
      opened: false,
      created_at: new Date().toISOString(),
    };

    if (user && SUPABASE_CONFIGURED) {
      const { data } = await supabase
        .from('daily_checkins')
        .upsert({ user_id: user.id, date: todayStr, mood, horoscope_text: horoscope, opened: false })
        .select()
        .single();
      if (data) newCheckin.id = (data as DailyCheckin).id;
    }

    setCheckins(prev => [...prev.filter(c => c.date !== todayStr), newCheckin]);
    setTodayCheckin(newCheckin);

    // Update streak + gems
    setUserProfile(prev => {
      if (!prev) return prev;
      const newStreak = prev.current_streak + 1;
      const milestoneBonus = getStreakMilestoneBonus(newStreak);
      const newGems = prev.gems + GEM_REWARDS.AURA_CHECKIN + milestoneBonus;
      const newXp = prev.xp + GEM_REWARDS.AURA_CHECKIN + milestoneBonus;
      const levelInfo = getLevelInfo(newXp);
      const updated = {
        ...prev,
        current_streak: newStreak,
        record_streak: Math.max(prev.record_streak, newStreak),
        gems: newGems,
        xp: newXp,
        level: levelInfo.level,
      };
      if (user && SUPABASE_CONFIGURED) {
        supabase.from('profiles').update({
          current_streak: updated.current_streak,
          record_streak: updated.record_streak,
          gems: updated.gems,
          xp: updated.xp,
          level: updated.level,
        }).eq('id', user.id);
      }
      return updated;
    });

    return newCheckin;
  }, [userProfile, user]);

  const revealHoroscope = useCallback(() => {
    if (!todayCheckin) return;

    setTodayCheckin(prev => prev ? { ...prev, opened: true } : prev);
    setCheckins(prev => prev.map(c => c.id === todayCheckin.id ? { ...c, opened: true } : c));

    if (user && SUPABASE_CONFIGURED) {
      supabase.from('daily_checkins').update({ opened: true }).eq('id', todayCheckin.id);
    }

    addGems(GEM_REWARDS.DAILY_HOROSCOPE);
  }, [todayCheckin, user, addGems]);

  const addOracleMessage = useCallback(() => {
    setOracleMessagesCount(prev => prev + 1);
  }, []);

  return (
    <AppContext.Provider value={{
      userProfile,
      checkins,
      todayCheckin,
      oracleMessagesCount,
      isLoading,
      updateProfile,
      addCheckin,
      revealHoroscope,
      addGems,
      addOracleMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
