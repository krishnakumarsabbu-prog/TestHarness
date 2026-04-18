export type FormFieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'email' | 'date'

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormFieldConfig {
  id: string
  type: FormFieldType
  label: string
  placeholder: string
  required: boolean
  helpText: string
  options: FormFieldOption[]
  validation: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
  }
}

export interface SavedFormConfig {
  id: string
  name: string
  description: string
  fields: FormFieldConfig[]
  createdAt: string
  updatedAt: string
}

export interface AlertFormMapping {
  id: string
  alertType: string
  sourceType: string
  formId: string
  createdAt: string
}

const STORAGE_KEY = 'alert_form_configs'
const ACTIVE_KEY = 'alert_form_active_id'
const MAPPINGS_KEY = 'alert_form_mappings'

export function loadFormConfigs(): SavedFormConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveFormConfigs(configs: SavedFormConfig[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
}

export function loadActiveFormId(): string | null {
  return localStorage.getItem(ACTIVE_KEY)
}

export function saveActiveFormId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id)
  } else {
    localStorage.removeItem(ACTIVE_KEY)
  }
}

export function loadAlertFormMappings(): AlertFormMapping[] {
  try {
    const raw = localStorage.getItem(MAPPINGS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAlertFormMappings(mappings: AlertFormMapping[]): void {
  localStorage.setItem(MAPPINGS_KEY, JSON.stringify(mappings))
}

export function getFormForAlert(alertType: string, sourceType: string): SavedFormConfig | null {
  const mappings = loadAlertFormMappings()
  const configs = loadFormConfigs()
  const mapping = mappings.find(m => m.alertType === alertType && m.sourceType === sourceType)
  if (!mapping) return null
  return configs.find(c => c.id === mapping.formId) ?? null
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
