interface SkeletonProps {
  className?: string
  lines?: number
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonProps) {
  const widths = ['w-full', 'w-4/5', 'w-3/5', 'w-2/3', 'w-5/6']
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${widths[i % widths.length]}`} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-surface-200 shadow-soft p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

export default Skeleton
