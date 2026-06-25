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
          ? 'shadow-[0_0_12px_rgba(212,168,67,0.3)]'
          : ''
      }`}
      style={
        isGold
          ? { background: 'rgba(212,168,67,0.15)', borderColor: 'rgba(212,168,67,0.3)', color: '#d4a843' }
          : isOrange
          ? { background: 'rgba(249,115,22,0.10)', borderColor: 'rgba(249,115,22,0.20)', color: '#fb923c' }
          : { background: 'rgba(124,58,237,0.15)', borderColor: 'rgba(139,92,246,0.3)', color: '#f0eeff' }
      }
    >
      <span role="img" aria-label="serie" className="text-base leading-none">
        🔥
      </span>
      <span className="text-[#f0eeff] font-semibold">{streak}</span>
      {streak >= 7 && (
        <span className="text-xs font-normal" style={{ color: 'rgba(212,168,67,0.8)' }}>serie</span>
      )}
    </div>
  );
}
