import { api } from './apiClient'

export interface BatchJob {
  id: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  config: Record<string, unknown>
  result?: Record<string, unknown>
  errorMessage?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BatchJobRequest {
  name: string
  type?: string
  config?: Record<string, unknown>
}

export const batchJobService = {
  getAll: () => api.get<BatchJob[]>('/api/batch-jobs'),

  getById: (id: string) => api.get<BatchJob>(`/api/batch-jobs/${id}`),

  create: (req: BatchJobRequest) => api.post<BatchJob>('/api/batch-jobs', req),

  execute: (id: string) => api.post<BatchJob>(`/api/batch-jobs/${id}/execute`, {}),

  delete: (id: string) => api.delete<void>(`/api/batch-jobs/${id}`),
}
