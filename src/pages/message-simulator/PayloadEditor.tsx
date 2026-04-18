import { useState, useCallback } from 'react'
import type { PayloadFormat } from './types'

interface ValidationResult {
  valid: boolean
  error?: string
}

function validateJSON(value: string): ValidationResult {
  try {
    JSON.parse(value)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

function validateXML(value: string): ValidationResult {
  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'application/xml')
  const error = doc.querySelector('parsererror')
  if (error) {
    return { valid: false, error: error.textContent?.split('\n')[0] ?? 'Invalid XML' }
  }
  return { valid: true }
}

function formatJSON(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

interface PayloadEditorProps {
  value: string
  onChange: (value: string) => void
  format: PayloadFormat
}

function PayloadEditor({ value, onChange, format }: PayloadEditorProps) {
  const [touched, setTouched] = useState(false)

  const validation = touched
    ? format === 'json'
      ? validateJSON(value)
      : validateXML(value)
    : { valid: true }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTouched(true)
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleFormat = useCallback(() => {
    if (format === 'json') {
      onChange(formatJSON(value))
    }
    setTouched(true)
  }, [value, format, onChange])

  const lineCount = value.split('\n').length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Payload</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
              format === 'json'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {format.toUpperCase()}
          </span>
          {touched && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                validation.valid
                  ? 'bg-success-50 text-success-700 border border-success-200'
                  : 'bg-danger-50 text-danger-700 border border-danger-200'
              }`}
            >
              {validation.valid ? 'Valid' : 'Invalid'}
            </span>
          )}
        </div>
        {format === 'json' && (
          <button
            type="button"
            onClick={handleFormat}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-surface-100 transition-colors font-medium"
          >
            Format
          </button>
        )}
      </div>

      <div className="relative rounded-xl border border-surface-200 overflow-hidden bg-slate-950 shadow-soft-sm">
        <div className="flex">
          <div
            className="select-none py-3 px-3 text-right font-mono text-xs text-slate-600 bg-slate-900 border-r border-slate-800 min-w-[3rem]"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-[1.6rem]">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            value={value}
            onChange={handleChange}
            spellCheck={false}
            className="flex-1 py-3 px-4 font-mono text-sm text-slate-100 bg-transparent resize-none outline-none leading-[1.6rem] min-h-[320px]"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {touched && !validation.valid && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-danger-50 border border-danger-100">
          <svg
            className="w-4 h-4 text-danger-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <span className="text-xs text-danger-700 font-mono">{validation.error}</span>
        </div>
      )}
    </div>
  )
}

export default PayloadEditor
