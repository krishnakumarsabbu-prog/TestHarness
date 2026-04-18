import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, SectionCard, Button } from '../components/ui'
import FormFieldEditor from '../components/settings/FormFieldEditor'
import FormPreview from '../components/settings/FormPreview'
import {
  loadFormConfigs,
  saveFormConfigs,
  loadActiveFormId,
  saveActiveFormId,
  generateId,
  type SavedFormConfig,
  type FormFieldConfig,
} from '../store/formConfigStore'

function emptyField(): FormFieldConfig {
  return {
    id: generateId(),
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    helpText: '',
    options: [],
    validation: {},
  }
}

function emptyConfig(): Omit<SavedFormConfig, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: '',
    description: '',
    fields: [],
  }
}

type ViewMode = 'list' | 'builder' | 'preview'

function Settings() {
  const navigate = useNavigate()
  const [configs, setConfigs] = useState<SavedFormConfig[]>(() => loadFormConfigs())
  const [activeId, setActiveId] = useState<string | null>(() => loadActiveFormId())
  const [view, setView] = useState<ViewMode>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyConfig())
  const [draftFields, setDraftFields] = useState<FormFieldConfig[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    saveFormConfigs(configs)
  }, [configs])

  useEffect(() => {
    saveActiveFormId(activeId)
  }, [activeId])

  const startNew = () => {
    setEditingId(null)
    setDraft(emptyConfig())
    setDraftFields([])
    setErrors({})
    setSaved(false)
    setView('builder')
  }

  const startEdit = (config: SavedFormConfig) => {
    setEditingId(config.id)
    setDraft({ name: config.name, description: config.description, fields: config.fields })
    setDraftFields(config.fields)
    setErrors({})
    setSaved(false)
    setView('builder')
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!draft.name.trim()) errs.name = 'Form name is required'
    draftFields.forEach((f, i) => {
      if (!f.label.trim()) errs[`field_${i}`] = `Field ${i + 1}: label is required`
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    if (editingId) {
      setConfigs(prev =>
        prev.map(c =>
          c.id === editingId
            ? { ...c, name: draft.name, description: draft.description, fields: draftFields, updatedAt: now }
            : c
        )
      )
    } else {
      const newConfig: SavedFormConfig = {
        id: generateId(),
        name: draft.name,
        description: draft.description,
        fields: draftFields,
        createdAt: now,
        updatedAt: now,
      }
      setConfigs(prev => [...prev, newConfig])
      setEditingId(newConfig.id)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id))
    if (activeId === id) setActiveId(null)
    setDeleteConfirm(null)
  }

  const handleSetActive = (id: string) => {
    setActiveId(id === activeId ? null : id)
  }

  const addField = () => setDraftFields(prev => [...prev, emptyField()])

  const updateField = (index: number, updated: FormFieldConfig) => {
    setDraftFields(prev => prev.map((f, i) => (i === index ? updated : f)))
  }

  const removeField = (index: number) => {
    setDraftFields(prev => prev.filter((_, i) => i !== index))
  }

  const moveField = (index: number, dir: 'up' | 'down') => {
    setDraftFields(prev => {
      const next = [...prev]
      const target = dir === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return next
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const inputBase =
    'w-full px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150'

  const hasErrors = Object.keys(errors).length > 0

  return (
    <PageContainer title="Settings" subtitle="Manage dynamic form configurations for the Alerts Onboarding page.">
      <div className="flex flex-col gap-6">
        {view === 'list' && (
          <>
            <SectionCard
              title="Form Configurations"
              description="Create and manage custom forms that appear on the Alerts Onboarding page."
              actions={
                <Button
                  size="sm"
                  onClick={startNew}
                  icon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  }
                >
                  New Form
                </Button>
              }
            >
              {configs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">No form configurations yet</p>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Create a custom form to display on the Alerts Onboarding page.
                    </p>
                  </div>
                  <Button size="sm" onClick={startNew} variant="secondary">
                    Create your first form
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {configs.map(config => (
                    <div key={config.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                        <svg className="w-4.5 h-4.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800 truncate">{config.name}</p>
                          {activeId === config.id && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 text-success-600 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {config.fields.length} field{config.fields.length !== 1 ? 's' : ''}
                          {config.description && ` · ${config.description}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant={activeId === config.id ? 'secondary' : 'ghost'}
                          onClick={() => handleSetActive(config.id)}
                          title={activeId === config.id ? 'Deactivate' : 'Set as active form'}
                        >
                          {activeId === config.id ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(config)}
                          icon={
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          }
                        >
                          Edit
                        </Button>
                        {deleteConfirm === config.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-danger-600 font-medium">Confirm?</span>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(config.id)}>Yes</Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)}>No</Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteConfirm(config.id)}
                            icon={
                              <svg className="w-3.5 h-3.5 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {activeId && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success-50 border border-success-100">
                <svg className="w-4 h-4 text-success-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-success-700 flex-1">
                  <span className="font-semibold">{configs.find(c => c.id === activeId)?.name}</span> is active and will appear on the Alerts Onboarding page.
                </p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/alerts-onboarding')}>
                  View Form
                </Button>
              </div>
            )}
          </>
        )}

        {(view === 'builder' || view === 'preview') && (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('list')}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to forms
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-medium text-slate-700">
                {editingId ? 'Edit Form' : 'New Form'}
              </span>
            </div>

            {saved && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success-50 border border-success-100 text-success-600 text-sm font-medium fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Form configuration saved successfully.
              </div>
            )}

            {hasErrors && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-danger-50 border border-danger-100 text-danger-600 text-sm fade-in">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="font-medium">Please fix these errors:</p>
                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-xs text-danger-500">
                    {Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 flex flex-col gap-6">
                <SectionCard title="Form Details" description="Name and describe this form configuration.">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Form Name <span className="text-danger-500">*</span>
                      </label>
                      <input
                        className={`${inputBase} ${errors.name ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100' : ''}`}
                        placeholder="e.g. Transaction Alert Form"
                        value={draft.name}
                        onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                      />
                      {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                      <textarea
                        className={`${inputBase} resize-none`}
                        rows={2}
                        placeholder="What is this form used for?"
                        value={draft.description}
                        onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Form Fields"
                  description="Build your form by adding and configuring fields."
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
                  {draftFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                      <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">No fields yet</p>
                        <p className="text-xs text-slate-400">Click "Add Field" to start building.</p>
                      </div>
                      <button
                        onClick={addField}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add your first field
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {draftFields.map((field, index) => (
                        <FormFieldEditor
                          key={field.id}
                          field={field}
                          index={index}
                          total={draftFields.length}
                          onChange={updated => updateField(index, updated)}
                          onRemove={() => removeField(index)}
                          onMoveUp={() => moveField(index, 'up')}
                          onMoveDown={() => moveField(index, 'down')}
                        />
                      ))}
                      <button
                        onClick={addField}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-surface-300 text-xs font-medium text-slate-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 mt-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add another field
                      </button>
                    </div>
                  )}
                </SectionCard>
              </div>

              <div className="lg:col-span-2">
                <div className="sticky top-6">
                  <SectionCard title="Live Preview" description="How this form will appear to users.">
                    <FormPreview fields={draftFields} />
                  </SectionCard>
                </div>
              </div>
            </div>

            <SectionCard title="Actions">
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  }
                >
                  Save Form
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setView('list')}
                >
                  Cancel
                </Button>
                {editingId && saved && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/alerts-onboarding')}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    }
                  >
                    View on Onboarding
                  </Button>
                )}
              </div>
            </SectionCard>
          </>
        )}
      </div>
    </PageContainer>
  )
}

export default Settings
