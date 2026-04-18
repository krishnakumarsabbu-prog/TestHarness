import { SectionCard, Button } from '../ui'
import FieldRow from './FieldRow'
import type { AlertField } from './types'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

interface Props {
  fields: AlertField[]
  onChange: (fields: AlertField[]) => void
  errors: Record<string, string>
}

function DynamicFormBuilder({ fields, onChange, errors }: Props) {
  const addField = () => {
    onChange([
      ...fields,
      {
        id: generateId(),
        fieldName: '',
        fieldType: 'Text',
        required: false,
        defaultValue: '',
        dropdownValues: '',
      },
    ])
  }

  const updateField = (index: number, updated: AlertField) => {
    const next = [...fields]
    next[index] = updated
    onChange(next)
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    const next = [...fields]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <SectionCard
      title="Dynamic Form Builder"
      description="Define the fields that will be captured for this alert type."
      actions={
        <Button
          size="sm"
          variant="secondary"
          onClick={addField}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
        >
          Add Field
        </Button>
      }
    >
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700">No fields defined yet</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Click "Add Field" to start building your alert schema.
            </p>
          </div>
          <button
            onClick={addField}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add your first field
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <FieldRow
              key={field.id}
              field={field}
              index={index}
              total={fields.length}
              onChange={updated => updateField(index, updated)}
              onRemove={() => removeField(index)}
              onMoveUp={() => moveField(index, 'up')}
              onMoveDown={() => moveField(index, 'down')}
              nameError={errors[`field_${index}_name`]}
            />
          ))}
          <button
            onClick={addField}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-surface-300 text-xs font-medium text-slate-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add another field
          </button>
        </div>
      )}
    </SectionCard>
  )
}

export default DynamicFormBuilder
