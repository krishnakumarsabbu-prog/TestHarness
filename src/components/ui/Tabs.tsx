import { useState, type ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'underline' | 'pill'
}

function Tabs({ tabs, defaultTab, onChange, variant = 'underline' }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  function handleSelect(id: string) {
    setActive(id)
    onChange?.(id)
  }

  const activeTab = tabs.find((t) => t.id === active)

  return (
    <div>
      <div
        className={`flex ${
          variant === 'underline'
            ? 'border-b border-surface-200 gap-0'
            : 'bg-surface-200 rounded-lg p-0.5 gap-0.5 w-fit'
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active

          if (variant === 'pill') {
            return (
              <button
                key={tab.id}
                onClick={() => handleSelect(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 active:scale-[0.97] ${
                  isActive
                    ? 'bg-ivory text-warm-900 shadow-soft-sm border border-surface-200'
                    : 'text-warm-500 hover:text-warm-700 hover:bg-ivory/50'
                }`}
              >
                {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-primary-100 text-primary-600' : 'bg-surface-300 text-warm-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 transition-all duration-150 -mb-px ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-warm-500 hover:text-warm-700 hover:border-surface-300'
              }`}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-primary-100 text-primary-600' : 'bg-surface-200 text-warm-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5" style={{ animation: 'fadeIn 0.15s ease-out both' }} key={active}>{activeTab?.content}</div>
    </div>
  )
}

export default Tabs
