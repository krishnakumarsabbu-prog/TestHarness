import { useState } from 'react'
import type { FormFieldConfig, FormFieldType, FormFieldOption } from '../../store/formConfigStore'
import { generateId } from '../../store/formConfigStore'

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
]

const FIELD_TYPE_ICONS: Record<FormFieldType, string> = {
  text: 'T',
  textarea: '¶',
  number: '#',
  email: '@',
  date: '📅',
  select: '▾',
  checkbox: '☑',
  radio: '◉',
}

const needsOptions = (type: FormFieldType) => type === 'select' || type === 'radio'

interface Props {
  field: FormFieldConfig
  index: number
  total: number
  onChange: (field: FormFieldConfig) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function FormFieldEditor({ field, index, total, onChange, onRemove, onMoveUp, onMoveDown }: Props) {
  const [expanded, setExpanded] = useState(index === 0)

  const set = <K extends keyof FormFieldConfig>(key: K, value: FormFieldConfig[K]) =>
    onChange({ ...field, [key]: value })

  const setValidation = (key: string, value: string | number | undefined) =>
    onChange({ ...field, validation: { ...field.validation, [key]: value === '' ? undefined : value } })

  const addOption = () => {
    const opts: FormFieldOption[] = [...field.options, { label: '', value: generateId() }]
    set('options', opts)
  }

  const updateOption = (i: number, label: string) => {
    const opts = field.options.map((o, idx) =>
      idx === i ? { ...o, label, value: label.toLowerCase().replace(/\s+/g, '_') } : o
    )
    set('options', opts)
  }

  const removeOption = (i: number) => {
    set('options', field.options.filter((_, idx) => idx !== i))
  }

  const inputBase =
    'w-full px-3 py-2 rounded-lg border border-surface-300 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150'

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundSize: '14px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
  }

  return (
    <div className="bg-white border border-surface-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary-200 hover:shadow-soft-sm">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none group"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onMoveUp() }}
            disabled={index === 0}
            className="p-0.5 rounded text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); onMoveDown() }}
            disabled={index === total - 1}
            className="p-0.5 rounded text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-xs font-bold shrink-0">
          {FIELD_TYPE_ICONS[field.type]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {field.label || <span className="text-slate-400 italic">Untitled field</span>}
          </p>
          <p className="text-xs text-slate-400">
            {FIELD_TYPES.find(t => t.value === field.type)?.label}
            {field.required && <span className="ml-2 text-danger-500">Required</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-danger-500 hover:bg-danger-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-surface-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Label <span className="text-danger-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="e.g. Customer Name"
                value={field.label}
                onChange={e => set('label', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Field Type</label>
              <select
                className={`${inputBase} pr-7 appearance-none`}
                style={selectStyle}
                value={field.type}
                onChange={e => set('type', e.target.value as FormFieldType)}
              >
                {FIELD_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {field.type !== 'checkbox' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Placeholder</label>
                <input
                  className={inputBase}
                  placeholder="e.g. Enter your name..."
                  value={field.placeholder}
                  onChange={e => set('placeholder', e.target.value)}
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Help Text</label>
              <input
                className={inputBase}
                placeholder="Optional hint shown below the field"
                value={field.helpText}
                onChange={e => set('helpText', e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                role="switch"
                aria-checked={field.required}
                onClick={() => set('required', !field.required)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                  field.required ? 'bg-primary-600' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${field.required ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
              </button>
              <span className="text-xs font-medium text-slate-600">Required field</span>
            </div>
          </div>

          {needsOptions(field.type) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-600">Options</label>
                <button
                  onClick={addOption}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add option
                </button>
              </div>
              <div className="space-y-2">
                {field.options.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No options added yet. Click "Add option" above.</p>
                )}
                {field.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`${inputBase} flex-1`}
                      placeholder={`Option ${i + 1}`}
                      value={opt.label}
                      onChange={e => updateOption(i, e.target.value)}
                    />
                    <button
                      onClick={() => removeOption(i)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-danger-500 hover:bg-danger-50 transition-all shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(field.type === 'text' || field.type === 'textarea' || field.type === 'email') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Min Length</label>
                <input
                  type="number"
                  className={inputBase}
                  placeholder="e.g. 2"
                  value={field.validation.minLength ?? ''}
                  onChange={e => setValidation('minLength', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Max Length</label>
                <input
                  type="number"
                  className={inputBase}
                  placeholder="e.g. 255"
                  value={field.validation.maxLength ?? ''}
                  onChange={e => setValidation('maxLength', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Min Value</label>
                <input
                  type="number"
                  className={inputBase}
                  placeholder="e.g. 0"
                  value={field.validation.min ?? ''}
                  onChange={e => setValidation('min', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Max Value</label>
                <input
                  type="number"
                  className={inputBase}
                  placeholder="e.g. 1000"
                  value={field.validation.max ?? ''}
                  onChange={e => setValidation('max', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FormFieldEditor
