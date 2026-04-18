import { useState, useCallback, type ChangeEvent } from 'react'

interface JSONEditorProps {
  value: string
  onChange?: (value: string, isValid: boolean) => void
  label?: string
  placeholder?: string
  rows?: number
  readOnly?: boolean
  className?: string
}

function JSONEditor({
  value,
  onChange,
  label,
  placeholder = '{\n  \n}',
  rows = 10,
  readOnly = false,
  className = '',
}: JSONEditorProps) {
  const [error, setError] = useState<string | null>(null)
  const [formatted, setFormatted] = useState(false)

  const validate = useCallback((raw: string): boolean => {
    if (!raw.trim()) {
      setError(null)
      return true
    }
    try {
      JSON.parse(raw)
      setError(null)
      return true
    } catch (e) {
      setError((e as Error).message)
      return false
    }
  }, [])

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const raw = e.target.value
    setFormatted(false)
    const valid = validate(raw)
    onChange?.(raw, valid)
  }

  function handleFormat() {
    try {
      const parsed = JSON.parse(value)
      const pretty = JSON.stringify(parsed, null, 2)
      setFormatted(true)
      setError(null)
      onChange?.(pretty, true)
    } catch {
      /* already showing error */
    }
  }

  function handleMinify() {
    try {
      const parsed = JSON.parse(value)
      const mini = JSON.stringify(parsed)
      setFormatted(false)
      setError(null)
      onChange?.(mini, true)
    } catch {
      /* already showing error */
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(value).catch(() => {})
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || !readOnly) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
          {!readOnly && (
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={handleFormat}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-surface-100 border border-surface-200 transition-colors"
              >
                Format
              </button>
              <button
                type="button"
                onClick={handleMinify}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-surface-100 border border-surface-200 transition-colors"
              >
                Minify
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-surface-100 border border-surface-200 transition-colors"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          rows={rows}
          placeholder={placeholder}
          spellCheck={false}
          className={`
            w-full px-4 py-3 rounded-xl border text-sm font-mono leading-relaxed
            bg-slate-900 text-slate-100 placeholder:text-slate-600
            resize-y transition-colors duration-150
            focus:outline-none focus:ring-2
            ${error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
              : formatted
              ? 'border-success-500 focus:border-success-500 focus:ring-success-500/20'
              : 'border-slate-700 focus:border-primary-400 focus:ring-primary-400/20'
            }
            ${readOnly ? 'cursor-default opacity-90' : ''}
          `}
        />

        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 pointer-events-none">
          {error ? (
            <span className="flex items-center gap-1 text-danger-400 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Invalid
            </span>
          ) : value.trim() ? (
            <span className="flex items-center gap-1 text-success-500 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Valid
            </span>
          ) : null}
        </div>
      </div>

      {error && <p className="text-xs text-danger-600 font-mono">{error}</p>}
    </div>
  )
}

export default JSONEditor
