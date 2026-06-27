import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider, useApp } from '@/contexts/AppContext';
import BottomNav from '@/components/BottomNav';
import Home from '@/pages/Home';
import Oracle from '@/pages/Oracle';
import Aura from '@/pages/Aura';
import Visioni from '@/pages/Visioni';
import Profile from '@/pages/Profile';
import Luna from '@/pages/Luna';
import Carte from '@/pages/Carte';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';

const TAB_ROUTES: Record<string, string> = {
  home: '/',
  oracle: '/oracle',
  luna: '/luna',
  carte: '/carte',
  aura: '/aura',
  visioni: '/visioni',
  profile: '/profile',
};

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = (() => {
    const path = location.pathname;
    if (path === '/')               return 'home';
    if (path.startsWith('/oracle')) return 'oracle';
    if (path.startsWith('/luna'))   return 'luna';
    if (path.startsWith('/carte'))  return 'carte';
    if (path.startsWith('/aura'))   return 'aura';
    if (path.startsWith('/visioni')) return 'visioni';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  })();

  function handleTabChange(tab: string) {
    navigate(TAB_ROUTES[tab] || '/');
  }

  return (
    <div className="min-h-screen bg-cosmic-void relative">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-energy-cyan/4 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-0 w-56 h-56 bg-cosmic-purple/6 rounded-full blur-3xl" />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"        element={<Home />} />
            <Route path="/oracle"  element={<Oracle />} />
            <Route path="/luna"    element={<Luna />} />
            <Route path="/carte"   element={<Carte />} />
            <Route path="/aura"    element={<Aura />} />
            <Route path="/visioni" element={<Visioni />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cosmic-void, #07060f)' }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed, #2e0a70)',
              boxShadow: '0 0 30px rgba(124,58,237,0.4)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <span className="text-white/60 text-lg">✦</span>
          </div>
          <p className="font-label text-[10px] tracking-[0.2em] text-[#4a4468] uppercase">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <AppProvider>
      <OnboardingGate />
    </AppProvider>
  );
}

const ONBOARDED_KEY = 'katharsis_onboarded';

function OnboardingGate() {
  const { userProfile, isLoading } = useApp();
  if (isLoading) return null;
  const done = userProfile?.onboarding_complete || localStorage.getItem(ONBOARDED_KEY) === 'true';
  if (!done) return <Onboarding />;
  return <AppShell />;
}


export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
