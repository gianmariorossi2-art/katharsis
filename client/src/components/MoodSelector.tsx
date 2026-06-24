import type { Mood } from '@/types';

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
}

const MOODS: MoodOption[] = [
  { mood: 'energico', emoji: '😤', label: 'Energico' },
  { mood: 'riflessivo', emoji: '🌙', label: 'Riflessivo' },
  { mood: 'romantico', emoji: '💖', label: 'Romantico' },
  { mood: 'ansioso', emoji: '😰', label: 'Ansioso' },
  { mood: 'curioso', emoji: '🔍', label: 'Curioso' },
  { mood: 'malinconico', emoji: '😔', label: 'Malinconico' },
];

interface MoodSelectorProps {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {MOODS.map(({ mood, emoji, label }) => {
        const isSelected = selected === mood;
        return (
          <button
            key={mood}
            onClick={() => onSelect(mood)}
            className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-center transition-all duration-200 font-body ${
              isSelected
                ? 'border-mystic-gold bg-mystic-gold/20 text-mystic-gold shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'border-border-subtle bg-surface-2/50 text-white/60 hover:border-white/20 hover:text-white/80'
            }`}
            aria-pressed={isSelected}
          >
            <span className="text-xl leading-none">{emoji}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
