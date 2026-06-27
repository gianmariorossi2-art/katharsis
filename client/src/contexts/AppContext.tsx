import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { UserProfile, DailyCheckin, DailyReading, Mood } from '@/types';
import { generateDailyHoroscope } from '@/lib/horoscope';
import { GEM_REWARDS, getStreakMilestoneBonus, getLevelInfo } from '@/lib/gamification';
import { fetchDailyReading } from '@/lib/dailyReading';
import {
  doc, getDoc, setDoc, getDocs,
  collection, query, where, orderBy, addDoc,
} from 'firebase/firestore';
import { db, FIREBASE_CONFIGURED } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const todayStr = new Date().toISOString().split('T')[0];
const today = new Date();

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

interface AppContextValue {
  userProfile: UserProfile | null;
  checkins: DailyCheckin[];
  todayCheckin: DailyCheckin | null;
  oracleMessagesCount: number;
  isLoading: boolean;
  dailyReading: DailyReading | null;
  dailyReadingLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addCheckin: (mood: Mood) => Promise<DailyCheckin>;
  revealHoroscope: () => void;
  addGems: (amount: number) => void;
  addOracleMessage: () => void;
  generateReading: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [oracleMessagesCount, setOracleMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyReading, setDailyReading] = useState<DailyReading | null>(null);
  const [dailyReadingLoading, setDailyReadingLoading] = useState(false);

  useEffect(() => {
    if (!user || !FIREBASE_CONFIGURED) {
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
        // Load profile — create it if missing, fall back to mock if denied
        try {
          const profileSnap = await getDoc(doc(db, 'profiles', user!.uid));
          if (profileSnap.exists()) {
            setUserProfile({ id: user!.uid, ...profileSnap.data() } as UserProfile);
          } else {
            // First login — write initial profile to Firestore
            const initial = { ...MOCK_USER, id: user!.uid, name: user!.displayName || 'Viandante' };
            const { id: _id, ...initialData } = initial;
            try {
              await setDoc(doc(db, 'profiles', user!.uid), {
                ...initialData,
                created_at: new Date().toISOString(),
              });
            } catch { /* rules not ready yet */ }
            setUserProfile(initial);
          }
        } catch {
          setUserProfile({ ...MOCK_USER, id: user!.uid, name: user!.displayName || 'Viandante' });
        }

        // Load checkins — fail silently
        try {
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];
          const checkinsSnap = await getDocs(
            query(
              collection(db, 'checkins'),
              where('userId', '==', user!.uid),
              where('date', '>=', twoWeeksAgoStr),
              orderBy('date', 'asc'),
            )
          );
          const loadedCheckins = checkinsSnap.docs.map(d => ({ id: d.id, ...d.data() } as DailyCheckin));
          setCheckins(loadedCheckins);
          setTodayCheckin(loadedCheckins.find(c => c.date === todayStr) ?? null);
        } catch {
          // Firestore rules not set up yet — checkins start empty
        }

        // Count oracle messages — fail silently
        try {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const oracleSnap = await getDocs(
            query(
              collection(db, 'oracle_messages'),
              where('userId', '==', user!.uid),
              where('createdAt', '>=', todayStart.toISOString()),
            )
          );
          setOracleMessagesCount(oracleSnap.size);
        } catch {
          // ignore
        }

        // Load today's cached daily reading from Firestore + image from localStorage
        try {
          const readingId = `${user!.uid}_${todayStr}`;
          const readingSnap = await getDoc(doc(db, 'daily_readings', readingId));
          if (readingSnap.exists()) {
            const reading = readingSnap.data() as DailyReading;
            const cachedImg = localStorage.getItem(`katharsis_img_${todayStr}`);
            if (cachedImg) reading.image_url = cachedImg;
            setDailyReading(reading);
          }
        } catch {
          // ignore — reading will be generated on demand
        }
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
      if (updates.xp !== undefined) updated.level = getLevelInfo(updated.xp).level;
      return updated;
    });
    if (user && FIREBASE_CONFIGURED) {
      try {
        const { id: _id, ...rest } = updates as UserProfile;
        await setDoc(doc(db, 'profiles', user.uid), rest as Record<string, unknown>, { merge: true });
      } catch { /* ignore */ }
    }
  }, [user]);

  const addGems = useCallback((amount: number) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      const newGems = prev.gems + amount;
      const newXp = prev.xp + amount;
      const level = getLevelInfo(newXp).level;
      const updated = { ...prev, gems: newGems, xp: newXp, level };
      if (user && FIREBASE_CONFIGURED) {
        setDoc(doc(db, 'profiles', user.uid), { gems: newGems, xp: newXp, level }, { merge: true }).catch(() => {});
      }
      return updated;
    });
  }, [user]);

  const addCheckin = useCallback(async (mood: Mood): Promise<DailyCheckin> => {
    const horoscope = generateDailyHoroscope(userProfile?.zodiac_sign || 'Leone', mood, today);
    const checkinData = {
      userId: user?.uid || 'mock-user-id',
      date: todayStr,
      mood,
      horoscope_text: horoscope,
      opened: false,
      created_at: new Date().toISOString(),
    };
    const docId = `${user?.uid || 'mock'}_${todayStr}`;
    const newCheckin: DailyCheckin = { id: docId, user_id: checkinData.userId, ...checkinData };

    // Always update local state first — Firestore is best-effort
    setCheckins(prev => [...prev.filter(c => c.date !== todayStr), newCheckin]);
    setTodayCheckin(newCheckin);

    if (user && FIREBASE_CONFIGURED) {
      try {
        await setDoc(doc(db, 'checkins', docId), checkinData, { merge: true });
      } catch { /* Firestore rules not set up yet — data lives in memory */ }
    }

    setUserProfile(prev => {
      if (!prev) return prev;
      const newStreak = prev.current_streak + 1;
      const milestoneBonus = getStreakMilestoneBonus(newStreak);
      const newGems = prev.gems + GEM_REWARDS.AURA_CHECKIN + milestoneBonus;
      const newXp = prev.xp + GEM_REWARDS.AURA_CHECKIN + milestoneBonus;
      const level = getLevelInfo(newXp).level;
      const updated = {
        ...prev,
        current_streak: newStreak,
        record_streak: Math.max(prev.record_streak, newStreak),
        gems: newGems, xp: newXp, level,
      };
      if (user && FIREBASE_CONFIGURED) {
        setDoc(doc(db, 'profiles', user.uid), {
          current_streak: updated.current_streak,
          record_streak: updated.record_streak,
          gems: updated.gems, xp: updated.xp, level: updated.level,
        }, { merge: true }).catch(() => {});
      }
      return updated;
    });

    return newCheckin;
  }, [userProfile, user]);

  const revealHoroscope = useCallback(() => {
    if (!todayCheckin) return;
    setTodayCheckin(prev => prev ? { ...prev, opened: true } : prev);
    setCheckins(prev => prev.map(c => c.id === todayCheckin.id ? { ...c, opened: true } : c));
    if (user && FIREBASE_CONFIGURED) {
      setDoc(doc(db, 'checkins', `${user.uid}_${todayStr}`), { opened: true }, { merge: true }).catch(() => {});
    }
    addGems(GEM_REWARDS.DAILY_HOROSCOPE);
  }, [todayCheckin, user, addGems]);

  const generateReading = useCallback(async () => {
    if (!userProfile || dailyReadingLoading) return;
    setDailyReadingLoading(true);
    try {
      const result = await fetchDailyReading(userProfile);
      setDailyReading(result.reading);

      // Cache natal chart + coordinates to profile
      if (result.natal_chart || result.birth_lat != null) {
        const profileUpdates: Partial<UserProfile> = {};
        if (result.natal_chart) profileUpdates.natal_chart = result.natal_chart;
        if (result.birth_lat != null) profileUpdates.birth_lat = result.birth_lat;
        if (result.birth_lon != null) profileUpdates.birth_lon = result.birth_lon;
        setUserProfile(prev => prev ? { ...prev, ...profileUpdates } : prev);
        if (user && FIREBASE_CONFIGURED) {
          setDoc(doc(db, 'profiles', user.uid), profileUpdates, { merge: true }).catch(() => {});
        }
      }

      // image_url is base64 (1-3MB) — too large for Firestore (1MB limit).
      // Store image in localStorage, text reading in Firestore.
      const { image_url, ...readingWithoutImage } = result.reading;
      if (image_url) {
        try { localStorage.setItem(`katharsis_img_${todayStr}`, image_url); } catch { /* storage full */ }
      }
      if (user && FIREBASE_CONFIGURED) {
        const readingId = `${user.uid}_${todayStr}`;
        setDoc(doc(db, 'daily_readings', readingId), readingWithoutImage, { merge: false }).catch(() => {});
      }
    } finally {
      setDailyReadingLoading(false);
    }
  }, [userProfile, user, dailyReadingLoading]);

  const addOracleMessage = useCallback(() => {
    setOracleMessagesCount(prev => prev + 1);
    if (user && FIREBASE_CONFIGURED) {
      addDoc(collection(db, 'oracle_messages'), {
        userId: user.uid,
        createdAt: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      userProfile, checkins, todayCheckin, oracleMessagesCount, isLoading,
      dailyReading, dailyReadingLoading,
      updateProfile, addCheckin, revealHoroscope, addGems, addOracleMessage, generateReading,
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
