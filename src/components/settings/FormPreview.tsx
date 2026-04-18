import type { FormFieldConfig } from '../../store/formConfigStore'

interface Props {
  fields: FormFieldConfig[]
}

function FormPreview({ fields }: Props) {
  const inputBase =
    'w-full px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150'

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-xs text-slate-400">Add fields to see a live preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {fields.map(field => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            {field.label || <span className="italic text-slate-400">Untitled</span>}
            {field.required && <span className="ml-1 text-danger-500">*</span>}
          </label>

          {field.type === 'text' && (
            <input readOnly className={inputBase} placeholder={field.placeholder || 'Text input'} />
          )}
          {field.type === 'email' && (
            <input readOnly type="email" className={inputBase} placeholder={field.placeholder || 'email@example.com'} />
          )}
          {field.type === 'number' && (
            <input readOnly type="number" className={inputBase} placeholder={field.placeholder || '0'} />
          )}
          {field.type === 'date' && (
            <input readOnly type="date" className={inputBase} />
          )}
          {field.type === 'textarea' && (
            <textarea readOnly rows={3} className={`${inputBase} resize-none`} placeholder={field.placeholder || 'Enter text...'} />
          )}
          {field.type === 'select' && (
            <select
              disabled
              className={`${inputBase} pr-8 appearance-none opacity-80`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                backgroundSize: '16px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
              }}
            >
              <option value="">{field.placeholder || 'Select an option...'}</option>
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label || opt.value}</option>
              ))}
            </select>
          )}
          {field.type === 'checkbox' && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                readOnly
                className="w-4 h-4 rounded border-surface-300 text-primary-600 accent-primary-600"
              />
              <span className="text-sm text-slate-600">{field.placeholder || field.label}</span>
            </label>
          )}
          {field.type === 'radio' && (
            <div className="space-y-2">
              {field.options.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No options defined</p>
              ) : (
                field.options.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" readOnly name={`preview-${field.id}`} className="w-4 h-4 accent-primary-600" />
                    <span className="text-sm text-slate-600">{opt.label || opt.value}</span>
                  </label>
                ))
              )}
            </div>
          )}

          {field.helpText && (
            <p className="text-xs text-slate-400 leading-relaxed">{field.helpText}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default FormPreview
