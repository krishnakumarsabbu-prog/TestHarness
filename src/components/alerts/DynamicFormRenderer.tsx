import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionCard, Button } from '../ui'
import type { SavedFormConfig, FormFieldConfig } from '../../store/formConfigStore'

interface Props {
  config: SavedFormConfig
}

type FormValues = Record<string, string | boolean | string[]>
type FormErrors = Record<string, string>

function validateField(field: FormFieldConfig, value: string | boolean | string[]): string {
  if (field.required) {
    if (typeof value === 'boolean' && !value) return `${field.label} is required`
    if (typeof value === 'string' && !value.trim()) return `${field.label} is required`
    if (Array.isArray(value) && value.length === 0) return `${field.label} is required`
  }
  if (typeof value === 'string' && value.trim()) {
    const { minLength, maxLength, min, max, pattern } = field.validation
    if (minLength !== undefined && value.length < minLength)
      return `${field.label} must be at least ${minLength} characters`
    if (maxLength !== undefined && value.length > maxLength)
      return `${field.label} must be at most ${maxLength} characters`
    if (field.type === 'number') {
      const num = Number(value)
      if (isNaN(num)) return `${field.label} must be a valid number`
      if (min !== undefined && num < min) return `${field.label} must be at least ${min}`
      if (max !== undefined && num > max) return `${field.label} must be at most ${max}`
    }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return `${field.label} must be a valid email address`
    if (pattern && !new RegExp(pattern).test(value))
      return `${field.label} is invalid`
  }
  return ''
}

function getInitialValues(fields: FormFieldConfig[]): FormValues {
  const vals: FormValues = {}
  for (const f of fields) {
    if (f.type === 'checkbox') vals[f.id] = false
    else vals[f.id] = ''
  }
  return vals
}

function DynamicFormRenderer({ config }: Props) {
  const navigate = useNavigate()
  const [values, setValues] = useState<FormValues>(() => getInitialValues(config.fields))
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const setValue = (id: string, value: string | boolean) => {
    setValues(prev => ({ ...prev, [id]: value }))
    if (errors[id]) {
      const field = config.fields.find(f => f.id === id)
      if (field) {
        const err = validateField(field, value)
        setErrors(prev => ({ ...prev, [id]: err }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    for (const field of config.fields) {
      const val = values[field.id] ?? ''
      const err = validateField(field, val)
      if (err) newErrors[field.id] = err
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
    }
  }

  const handleReset = () => {
    setValues(getInitialValues(config.fields))
    setErrors({})
    setSubmitted(false)
  }

  const inputBase =
    'w-full px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150'

  const errorInputClass = 'border-danger-400 focus:border-danger-400 focus:ring-danger-100'

  if (submitted) {
    return (
      <SectionCard title={config.name} description={config.description}>
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-slate-800">Form submitted successfully</p>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Your alert onboarding form has been submitted. The configuration is ready for processing.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Button variant="secondary" onClick={handleReset}>
              Submit another
            </Button>
            <Button variant="ghost" onClick={() => navigate('/settings')}>
              Edit form in Settings
            </Button>
          </div>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title={config.name}
      description={config.description || 'Complete the form below to onboard this alert configuration.'}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-5">
          {config.fields.map(field => (
            <div key={field.id} className="flex flex-col gap-1.5">
              {field.type !== 'checkbox' && (
                <label className="text-sm font-medium text-slate-700">
                  {field.label}
                  {field.required && <span className="ml-1 text-danger-500">*</span>}
                </label>
              )}

              {field.type === 'text' && (
                <input
                  type="text"
                  className={`${inputBase} ${errors[field.id] ? errorInputClass : ''}`}
                  placeholder={field.placeholder}
                  value={values[field.id] as string ?? ''}
                  onChange={e => setValue(field.id, e.target.value)}
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  className={`${inputBase} ${errors[field.id] ? errorInputClass : ''}`}
                  placeholder={field.placeholder || 'email@example.com'}
                  value={values[field.id] as string ?? ''}
                  onChange={e => setValue(field.id, e.target.value)}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  className={`${inputBase} ${errors[field.id] ? errorInputClass : ''}`}
                  placeholder={field.placeholder}
                  min={field.validation.min}
                  max={field.validation.max}
                  value={values[field.id] as string ?? ''}
                  onChange={e => setValue(field.id, e.target.value)}
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  className={`${inputBase} ${errors[field.id] ? errorInputClass : ''}`}
                  value={values[field.id] as string ?? ''}
                  onChange={e => setValue(field.id, e.target.value)}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  rows={3}
                  className={`${inputBase} resize-y ${errors[field.id] ? errorInputClass : ''}`}
                  placeholder={field.placeholder}
                  value={values[field.id] as string ?? ''}
                  onChange={e => setValue(field.id, e.target.value)}
                />
              )}

              {field.type === 'select' && (
                <select
                  className={`${inputBase} pr-8 appearance-none ${errors[field.id] ? errorInputClass : ''}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '16px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                  value={values[field.id] as string ?? ''}
                  onChange={e => setValue(field.id, e.target.value)}
                >
                  <option value="">{field.placeholder || 'Select an option...'}</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label || opt.value}</option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={values[field.id] as boolean ?? false}
                      onChange={e => setValue(field.id, e.target.checked)}
                    />
                    <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                      values[field.id]
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-surface-300 group-hover:border-primary-400'
                    }`}>
                      {values[field.id] && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      {field.label}
                      {field.required && <span className="ml-1 text-danger-500">*</span>}
                    </span>
                    {field.helpText && (
                      <p className="text-xs text-slate-400 mt-0.5">{field.helpText}</p>
                    )}
                  </div>
                </label>
              )}

              {field.type === 'radio' && (
                <div className="space-y-2.5">
                  {field.options.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No options configured</p>
                  ) : (
                    field.options.map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name={field.id}
                            className="sr-only"
                            value={opt.value}
                            checked={values[field.id] === opt.value}
                            onChange={() => setValue(field.id, opt.value)}
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            values[field.id] === opt.value
                              ? 'border-primary-600'
                              : 'border-surface-300 group-hover:border-primary-400'
                          }`}>
                            {values[field.id] === opt.value && (
                              <div className="w-2 h-2 rounded-full bg-primary-600" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-slate-700">{opt.label || opt.value}</span>
                      </label>
                    ))
                  )}
                </div>
              )}

              {errors[field.id] && (
                <p className="text-xs text-danger-600 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {errors[field.id]}
                </p>
              )}

              {field.helpText && field.type !== 'checkbox' && !errors[field.id] && (
                <p className="text-xs text-slate-400 leading-relaxed">{field.helpText}</p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2 border-t border-surface-100 mt-2">
            <Button type="submit" variant="primary">
              Submit Form
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Clear
            </Button>
          </div>
        </div>
      </form>
    </SectionCard>
  )
}

export default DynamicFormRenderer
