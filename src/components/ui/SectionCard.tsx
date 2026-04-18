import type { ReactNode } from 'react'

interface SectionCardProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

function SectionCard({ title, description, actions, children, className = '', noPadding = false }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-surface-200 transition-shadow duration-200 hover:shadow-soft-md ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-surface-100">
          <div>
            {title && <h2 className="text-sm font-semibold text-slate-800">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  )
}

export default SectionCard
