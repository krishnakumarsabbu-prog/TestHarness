interface Metric {
  label: string
  value: number
  icon: React.ReactNode
  colorClass: string
  bgClass: string
  borderClass: string
  trend?: string
}

interface MetricCardsProps {
  total: number
  success: number
  failed: number
  slaBreaches: number
  loading?: boolean
}

function MetricCard({ metric, loading }: { metric: Metric; loading?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border ${metric.borderClass} shadow-soft p-5 flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl ${metric.bgClass} flex items-center justify-center shrink-0`}>
        <span className={metric.colorClass}>{metric.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</p>
        {loading ? (
          <div className="skeleton-shimmer h-7 w-16 rounded-lg mt-1.5" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">{metric.value.toLocaleString()}</p>
        )}
        {metric.trend && !loading && (
          <p className="text-xs text-slate-400 mt-0.5">{metric.trend}</p>
        )}
      </div>
    </div>
  )
}

function MetricCards({ total, success, failed, slaBreaches, loading }: MetricCardsProps) {
  const metrics: Metric[] = [
    {
      label: 'Total Alerts',
      value: total,
      bgClass: 'bg-primary-50',
      colorClass: 'text-primary-600',
      borderClass: 'border-surface-200',
      trend: 'All executions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      ),
    },
    {
      label: 'Success Count',
      value: success,
      bgClass: 'bg-success-50',
      colorClass: 'text-success-600',
      borderClass: 'border-success-100',
      trend: total > 0 ? `${Math.round((success / total) * 100)}% success rate` : '—',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'Failed Count',
      value: failed,
      bgClass: 'bg-danger-50',
      colorClass: 'text-danger-600',
      borderClass: 'border-danger-100',
      trend: total > 0 ? `${Math.round((failed / total) * 100)}% failure rate` : '—',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'SLA Breaches',
      value: slaBreaches,
      bgClass: 'bg-warning-50',
      colorClass: 'text-warning-600',
      borderClass: 'border-warning-100',
      trend: 'Processing > 3s',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} metric={m} loading={loading} />
      ))}
    </div>
  )
}

export default MetricCards
