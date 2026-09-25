export function StreakBadge({ current, longest }: { current: number, longest: number }) {
  return (
    <div className="text-sm text-muted font-sans">
      {current > 0 ? (
        <span>{current}-day streak <span className="mx-1 opacity-50">•</span> longest: {longest}</span>
      ) : (
        <span>No current streak <span className="mx-1 opacity-50">•</span> longest: {longest}</span>
      )}
    </div>
  )
}
