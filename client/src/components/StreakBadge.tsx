interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const isGold = streak >= 7;
  const isOrange = streak >= 3 && streak < 7;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold font-body transition-all duration-300 ${
        isGold
          ? 'bg-mystic-gold/15 border-mystic-gold/30 text-mystic-gold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
          : isOrange
          ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
          : 'bg-white/5 border-white/10 text-white/60'
      }`}
    >
      <span role="img" aria-label="serie" className="text-base leading-none">
        🔥
      </span>
      <span>{streak}</span>
      {streak >= 7 && (
        <span className="text-xs font-normal text-mystic-gold/80">serie</span>
      )}
    </div>
  );
}
