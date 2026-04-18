import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

interface BaseFieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  as?: 'input'
}

interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  as: 'textarea'
  rows?: number
}

interface SelectFieldProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  as: 'select'
  children: ReactNode
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps

function FormField(props: FormFieldProps) {
  const { label, hint, error, required, className = '', as = 'input', ...rest } = props

  const baseInputClass = `input ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100' : ''}`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-danger-500">*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={(props as TextareaFieldProps).rows ?? 3}
          className={`${baseInputClass} resize-y`}
        />
      ) : as === 'select' ? (
        <select
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
          className={`${baseInputClass} pr-8 appearance-none bg-no-repeat bg-[right_0.75rem_center]`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
            backgroundSize: '16px',
          }}
        >
          {(props as SelectFieldProps).children}
        </select>
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={baseInputClass}
        />
      )}

      {error && <p className="text-xs text-danger-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export default FormField
