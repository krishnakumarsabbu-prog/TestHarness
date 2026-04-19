import { useState } from 'react'

const environments = ['DEV', 'RQA'] as const
type Environment = typeof environments[number]

function Header() {
  const [env, setEnv] = useState<Environment>('DEV')

  return (
    <header className="h-14 bg-ivory border-b border-surface-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-soft-sm">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shadow-soft-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-warm-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>AlertsHub</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-surface-100 rounded-lg p-0.5 border border-surface-200">
          {environments.map((e) => (
            <button
              key={e}
              onClick={() => setEnv(e)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
                env === e
                  ? 'bg-ivory text-warm-900 shadow-soft-sm border border-surface-200'
                  : 'text-warm-500 hover:text-warm-700'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-surface-300" />

        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-100 transition-all duration-150 active:scale-[0.98] group">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <span className="text-sm text-warm-600 group-hover:text-warm-900 hidden sm:block font-medium">User</span>
          <svg className="w-3 h-3 text-warm-400 hidden sm:block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
