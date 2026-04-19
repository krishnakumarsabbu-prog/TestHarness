import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

function PageContainer({ title, subtitle, actions, children }: PageContainerProps) {
  return (
    <div className="space-y-5" style={{ animation: 'slideUp 0.2s ease-out both' }}>
      <div className="flex items-start justify-between gap-4 pb-1">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 pt-0.5">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default PageContainer
