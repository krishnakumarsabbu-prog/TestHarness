import { api } from './apiClient'

export interface TransactionLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
}

export interface Transaction {
  id: string
  messageId: string
  alertName: string
  channel: string
  status: string
  createdTime: string
  processingTimeMs: number
  inboundSource: string
  messageKeyType: string
  messageValue: string
  templateUsed: string
  triggerSource: string
  deliveryStatus: string
  payload: Record<string, unknown>
  logs: TransactionLog[]
}

export interface TransactionPage {
  content: Transaction[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface TransactionMetrics {
  total: number
  success: number
  failed: number
  pending: number
  slaBreaches: number
}

export interface TransactionFilters {
  inboundSource?: string
  messageKeyType?: string
  channel?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}

export const transactionService = {
  getAll: (filters: TransactionFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.inboundSource) params.set('inboundSource', filters.inboundSource)
    if (filters.messageKeyType) params.set('messageKeyType', filters.messageKeyType)
    if (filters.channel) params.set('channel', filters.channel)
    if (filters.status) params.set('status', filters.status)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.page !== undefined) params.set('page', String(filters.page))
    if (filters.size !== undefined) params.set('size', String(filters.size))
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortDir) params.set('sortDir', filters.sortDir)
    return api.get<TransactionPage>(`/api/transactions?${params.toString()}`)
  },

  getById: (id: string) => api.get<Transaction>(`/api/transactions/${id}`),

  getMetrics: () => api.get<TransactionMetrics>('/api/transactions/metrics'),

  create: (req: Partial<Transaction>) =>
    api.post<Transaction>('/api/transactions', req),

  update: (id: string, req: Partial<Transaction>) =>
    api.put<Transaction>(`/api/transactions/${id}`, req),
}
