import { api } from './apiClient'

export interface AlertTemplate {
  id: string
  name: string
  channel: string
  language: string
  version: string
  subject: string
  body: string
  htmlTemplate: string
  variables: string[]
  status: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface TemplateFilters {
  name?: string
  channel?: string
  language?: string
  version?: string
}

export interface TemplateRequest {
  name: string
  channel: string
  language?: string
  version: string
  subject?: string
  body?: string
  htmlTemplate?: string
  variables?: string[]
  status?: string
  metadata?: Record<string, unknown>
}

export const templateService = {
  getAll: (filters: TemplateFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.name) params.set('name', filters.name)
    if (filters.channel) params.set('channel', filters.channel)
    if (filters.language) params.set('language', filters.language)
    if (filters.version) params.set('version', filters.version)
    const query = params.toString()
    return api.get<AlertTemplate[]>(`/api/templates${query ? '?' + query : ''}`)
  },

  getById: (id: string) => api.get<AlertTemplate>(`/api/templates/${id}`),

  create: (req: TemplateRequest) => api.post<AlertTemplate>('/api/templates', req),

  update: (id: string, req: TemplateRequest) =>
    api.put<AlertTemplate>(`/api/templates/${id}`, req),

  delete: (id: string) => api.delete<void>(`/api/templates/${id}`),
}
