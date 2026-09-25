export function ProgressBar({ progress, total, isPerfect }: { progress: number; total: number; isPerfect?: boolean }) {
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  return (
    <div className="h-0.5 w-full bg-line overflow-hidden rounded-full">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${isPerfect ? 'bg-gold' : 'bg-accent'}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
