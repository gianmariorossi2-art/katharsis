import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabIcons: Record<string, JSX.Element> = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  oracle: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="2.05" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.95" y2="12" />
      <line x1="12" y1="2.05" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.95" />
    </svg>
  ),
  luna: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  carte: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 9 L14 13 L12 17 L10 13 Z" />
    </svg>
  ),
  aura: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  visioni: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  profile: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const tabIds = ['home', 'oracle', 'luna', 'carte', 'aura', 'visioni', 'profile'];

const tabTranslationKeys: Record<string, string> = {
  home: 'nav.home',
  oracle: 'nav.oracle',
  luna: 'nav.moon',
  carte: 'nav.cards',
  aura: 'nav.aura',
  visioni: 'nav.visions',
  profile: 'nav.profile',
};

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(139,92,246,0.2)]"
      style={{ background: 'rgba(7,6,15,0.88)', backdropFilter: 'blur(20px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center overflow-x-auto scrollbar-hide h-16 px-1">
        {tabIds.map((id) => {
          const isActive = activeTab === id;
          const label = t(tabTranslationKeys[id]);
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 flex-shrink-0 relative transition-colors duration-200 font-body min-w-[60px] ${
                isActive ? 'text-[#a78bfa]' : 'text-[#4a4468] hover:text-[#9b93c4]'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`transition-transform duration-200 ${
                  isActive && !shouldReduceMotion ? 'scale-110' : 'scale-100'
                }`}
              >
                {tabIcons[id]}
              </span>
              <span className="text-[9px] font-medium tracking-wide">{label}</span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a78bfa]"
                  style={{ boxShadow: '0 0 6px rgba(167,139,250,0.8)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
