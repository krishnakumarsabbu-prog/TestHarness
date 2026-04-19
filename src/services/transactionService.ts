import { db } from '../store/memoryDb'
import type { Transaction as MockTransaction } from '../pages/transactions/mockData'

export interface TransactionLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
}

export type Transaction = MockTransaction

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
  getAll: (filters: TransactionFilters = {}): Promise<TransactionPage> =>
    Promise.resolve(db.transactions.getAll(filters) as TransactionPage),

  getById: (id: string): Promise<Transaction | undefined> =>
    Promise.resolve(db.transactions.getById(id)),

  getMetrics: (): Promise<TransactionMetrics> =>
    Promise.resolve(db.transactions.getMetrics()),

  create: (req: Partial<Transaction>): Promise<Transaction> =>
    Promise.resolve(req as Transaction),

  update: (id: string, req: Partial<Transaction>): Promise<Transaction> =>
    Promise.resolve({ ...req, id } as Transaction),
}
