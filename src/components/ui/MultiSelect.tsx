import { useState, useRef, useEffect } from 'react'

interface MultiSelectProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select…',
  required,
  hint,
  error,
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    )
  }

  const displayValue =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`

  const borderClass = error
    ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100'
    : open
    ? 'border-[#3898ec] ring-2 ring-[#3898ec]/15'
    : 'border-surface-300'

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      <label className="text-xs font-medium text-warm-700">
        {label}
        {required && <span className="ml-1 text-danger-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`w-full px-3 py-2 rounded-xl border bg-ivory text-sm text-left transition-colors duration-150 flex items-center justify-between gap-2 ${borderClass} ${selected.length === 0 ? 'text-warm-400' : 'text-warm-900'}`}
        >
          <span className="truncate">{displayValue}</span>
          <svg
            className={`w-4 h-4 text-warm-400 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {open && (
          <div
            className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-ivory rounded-xl border border-surface-200 shadow-soft-md overflow-hidden"
            style={{ animation: 'slideUp 0.12s ease-out both' }}
          >
            {options.map((option) => {
              const isSelected = selected.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(option)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-surface-100 active:bg-surface-200 transition-colors duration-100"
                >
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-150 ${
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-surface-300 bg-ivory'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </span>
                  <span className={isSelected ? 'text-warm-900 font-medium' : 'text-warm-600'}>{option}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium border border-primary-100"
            >
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="hover:text-primary-900 transition-colors duration-100"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-danger-600">{error}</p>}
      {hint && !error && <p className="text-xs text-warm-400">{hint}</p>}
    </div>
  )
}

export default MultiSelect
