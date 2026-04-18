import type { AlertField, FieldType } from './types'

const FIELD_TYPES: FieldType[] = ['Text', 'Number', 'Boolean', 'Dropdown', 'JSON']

interface Props {
  field: AlertField
  index: number
  total: number
  onChange: (field: AlertField) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  nameError?: string
}

function FieldRow({ field, index, total, onChange, onRemove, onMoveUp, onMoveDown, nameError }: Props) {
  const set = (key: keyof AlertField, value: string | boolean) =>
    onChange({ ...field, [key]: value })

  const inputBase =
    'w-full px-3 py-2 rounded-lg border border-surface-300 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150'

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundSize: '14px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
  }

  return (
    <div className="group relative bg-surface-50 border border-surface-200 rounded-xl p-4 transition-all duration-200 hover:border-primary-200 hover:shadow-soft-sm slide-up">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1 pt-1 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-surface-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
          <span className="text-center text-xs font-semibold text-slate-400 leading-none py-0.5">
            {index + 1}
          </span>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Move down"
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-surface-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Field Name <span className="text-danger-500">*</span>
            </label>
            <input
              className={`${inputBase} ${nameError ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100' : ''}`}
              placeholder="e.g. amount"
              value={field.fieldName}
              onChange={e => set('fieldName', e.target.value)}
            />
            {nameError && (
              <p className="mt-1 text-xs text-danger-600">{nameError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Field Type</label>
            <select
              className={`${inputBase} pr-7 appearance-none`}
              style={selectStyle}
              value={field.fieldType}
              onChange={e => set('fieldType', e.target.value as FieldType)}
            >
              {FIELD_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Default Value</label>
            <input
              className={inputBase}
              placeholder={field.fieldType === 'Boolean' ? 'true / false' : 'optional'}
              value={field.defaultValue}
              onChange={e => set('defaultValue', e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-xs font-medium text-slate-600 mb-1">Required</label>
            <button
              role="switch"
              aria-checked={field.required}
              onClick={() => set('required', !field.required)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 ${
                field.required ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  field.required ? 'translate-x-[18px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </div>

          {field.fieldType === 'Dropdown' && (
            <div className="col-span-2 sm:col-span-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Dropdown Values
                <span className="ml-1.5 font-normal text-slate-400">(comma-separated)</span>
              </label>
              <input
                className={inputBase}
                placeholder="e.g. Low, Medium, High, Critical"
                value={field.dropdownValues}
                onChange={e => set('dropdownValues', e.target.value)}
              />
            </div>
          )}
        </div>

        <button
          onClick={onRemove}
          title="Remove field"
          className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-all duration-150 shrink-0 mt-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FieldRow
