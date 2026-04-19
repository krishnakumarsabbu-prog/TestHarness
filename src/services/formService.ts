import { api } from './apiClient'
import type { SavedFormConfig, AlertFormMapping } from '../store/formConfigStore'

export interface FormConfigRequest {
  name: string
  description?: string
  fields: SavedFormConfig['fields']
}

export interface AlertFormMappingRequest {
  alertType: string
  sourceType: string
  formId: string
}

export const formService = {
  getAllForms: () => api.get<SavedFormConfig[]>('/api/forms'),

  getFormById: (id: string) => api.get<SavedFormConfig>(`/api/forms/${id}`),

  createForm: (req: FormConfigRequest) =>
    api.post<SavedFormConfig>('/api/forms', req),

  updateForm: (id: string, req: FormConfigRequest) =>
    api.put<SavedFormConfig>(`/api/forms/${id}`, req),

  deleteForm: (id: string) => api.delete<void>(`/api/forms/${id}`),

  getAllMappings: () => api.get<AlertFormMapping[]>('/api/forms/mappings'),

  createMapping: (req: AlertFormMappingRequest) =>
    api.post<AlertFormMapping>('/api/forms/mappings', req),

  deleteMapping: (id: string) => api.delete<void>(`/api/forms/mappings/${id}`),

  resolveForm: (alertType: string, sourceType: string) =>
    api.get<SavedFormConfig>(`/api/forms/resolve?alertType=${encodeURIComponent(alertType)}&sourceType=${encodeURIComponent(sourceType)}`),
}
