import { MOCK_TRANSACTIONS, type Transaction as MockTransaction } from '../pages/transactions/mockData'
import { INITIAL_SCENARIOS } from '../pages/message-simulator/mockData'
import type { Scenario } from '../pages/message-simulator/types'
import type { SavedFormConfig, AlertFormMapping } from './formConfigStore'

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

export interface SimulationLog {
  status: string
  httpStatus?: number
  responseTime?: number
  message?: string
  logs: Array<{ level: string; message: string; timestamp: string }>
  timestamp?: string
  logId?: string
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

function loadOrInit<T>(key: string, initial: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
  } catch {}
  return initial
}

function persist<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

const KEYS = {
  templates: 'mem_templates',
  transactions: 'mem_transactions',
  batchJobs: 'mem_batch_jobs',
  formConfigs: 'alert_form_configs',
  formMappings: 'alert_form_mappings',
  scenarios: 'mem_scenarios',
  simLogs: 'mem_sim_logs',
}

const SEED_FLAGS = {
  templates: 'mem_seeded_templates',
  transactions: 'mem_seeded_transactions',
  scenarios: 'mem_seeded_scenarios',
}

function seedOnce<T>(flagKey: string, storageKey: string, data: T[]): T[] {
  if (!localStorage.getItem(flagKey)) {
    persist(storageKey, data)
    localStorage.setItem(flagKey, '1')
    return data
  }
  return loadOrInit<T>(storageKey, data)
}

const SEED_TEMPLATES: AlertTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Payment Confirmation',
    channel: 'Email',
    language: 'en',
    version: '1.0',
    subject: 'Your payment has been confirmed',
    body: 'Dear {{name}}, your payment of {{amount}} has been successfully processed.',
    htmlTemplate: '<p>Dear <strong>{{name}}</strong>, your payment of <strong>{{amount}}</strong> has been successfully processed.</p>',
    variables: ['name', 'amount'],
    status: 'active',
    metadata: {},
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'tpl-2',
    name: 'Fraud Alert',
    channel: 'SMS',
    language: 'en',
    version: '1.0',
    subject: 'Suspicious activity detected',
    body: 'Alert: Suspicious activity on account {{accountId}}. If this was not you, call {{supportNumber}} immediately.',
    htmlTemplate: '',
    variables: ['accountId', 'supportNumber'],
    status: 'active',
    metadata: {},
    createdAt: '2026-04-02T10:00:00Z',
    updatedAt: '2026-04-02T10:00:00Z',
  },
  {
    id: 'tpl-3',
    name: 'Low Balance Warning',
    channel: 'Push',
    language: 'en',
    version: '1.0',
    subject: 'Low balance warning',
    body: 'Your account balance is below {{threshold}}. Current balance: {{balance}}.',
    htmlTemplate: '',
    variables: ['threshold', 'balance'],
    status: 'active',
    metadata: {},
    createdAt: '2026-04-03T10:00:00Z',
    updatedAt: '2026-04-03T10:00:00Z',
  },
]

export const db = {
  templates: {
    _data: (): AlertTemplate[] => seedOnce<AlertTemplate>(SEED_FLAGS.templates, KEYS.templates, SEED_TEMPLATES),
    _save(data: AlertTemplate[]) { persist(KEYS.templates, data) },

    getAll(filters: { name?: string; channel?: string; language?: string; version?: string } = {}): AlertTemplate[] {
      let data = this._data()
      if (filters.name) data = data.filter(t => t.name.toLowerCase().includes(filters.name!.toLowerCase()))
      if (filters.channel) data = data.filter(t => t.channel === filters.channel)
      if (filters.language) data = data.filter(t => t.language === filters.language)
      if (filters.version) data = data.filter(t => t.version === filters.version)
      return data
    },
    getById(id: string): AlertTemplate | undefined {
      return this._data().find(t => t.id === id)
    },
    create(req: Omit<AlertTemplate, 'id' | 'createdAt' | 'updatedAt'>): AlertTemplate {
      const data = this._data()
      const item: AlertTemplate = { ...req, id: genId(), createdAt: now(), updatedAt: now() }
      data.push(item)
      this._save(data)
      return item
    },
    update(id: string, req: Partial<AlertTemplate>): AlertTemplate | undefined {
      const data = this._data()
      const idx = data.findIndex(t => t.id === id)
      if (idx === -1) return undefined
      data[idx] = { ...data[idx], ...req, id, updatedAt: now() }
      this._save(data)
      return data[idx]
    },
    delete(id: string): boolean {
      const data = this._data()
      const next = data.filter(t => t.id !== id)
      if (next.length === data.length) return false
      this._save(next)
      return true
    },
  },

  transactions: {
    _data: (): MockTransaction[] => seedOnce<MockTransaction>(SEED_FLAGS.transactions, KEYS.transactions, MOCK_TRANSACTIONS),
    _save(data: MockTransaction[]) { persist(KEYS.transactions, data) },

    getAll(filters: {
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
    } = {}) {
      let data = this._data()
      if (filters.inboundSource) data = data.filter(t => t.inboundSource === filters.inboundSource)
      if (filters.messageKeyType) data = data.filter(t => t.messageKeyType === filters.messageKeyType)
      if (filters.channel) data = data.filter(t => t.channel === filters.channel)
      if (filters.status) data = data.filter(t => t.status === filters.status)
      if (filters.dateFrom) data = data.filter(t => new Date(t.createdTime) >= new Date(filters.dateFrom!))
      if (filters.dateTo) data = data.filter(t => new Date(t.createdTime) <= new Date(filters.dateTo!))

      const sortBy = (filters.sortBy as keyof MockTransaction) || 'createdTime'
      const sortDir = filters.sortDir || 'desc'
      data = [...data].sort((a, b) => {
        const av = String(a[sortBy])
        const bv = String(b[sortBy])
        return sortDir === 'asc' ? (av < bv ? -1 : 1) : av > bv ? -1 : 1
      })

      const page = filters.page ?? 0
      const size = filters.size ?? 20
      const total = data.length
      const content = data.slice(page * size, page * size + size)
      return { content, totalElements: total, totalPages: Math.ceil(total / size), number: page, size }
    },
    getById(id: string): MockTransaction | undefined {
      return this._data().find(t => t.id === id)
    },
    getMetrics() {
      const data = this._data()
      return {
        total: data.length,
        success: data.filter(t => t.status === 'Success').length,
        failed: data.filter(t => t.status === 'Failed').length,
        pending: data.filter(t => t.status === 'Pending').length,
        slaBreaches: data.filter(t => t.processingTimeMs > 3000).length,
      }
    },
  },

  batchJobs: {
    _data: (): BatchJob[] => loadOrInit<BatchJob>(KEYS.batchJobs, []),
    _save(data: BatchJob[]) { persist(KEYS.batchJobs, data) },

    getAll(): BatchJob[] { return this._data() },
    getById(id: string): BatchJob | undefined { return this._data().find(j => j.id === id) },
    create(req: { name: string; type?: string; config?: Record<string, unknown> }): BatchJob {
      const data = this._data()
      const item: BatchJob = {
        id: genId(), name: req.name, type: req.type || 'GENERIC',
        status: 'pending', config: req.config || {}, createdAt: now(), updatedAt: now(),
      }
      data.push(item)
      this._save(data)
      return item
    },
    execute(id: string): BatchJob | undefined {
      const data = this._data()
      const idx = data.findIndex(j => j.id === id)
      if (idx === -1) return undefined
      data[idx] = {
        ...data[idx], status: 'completed', startedAt: now(), completedAt: now(), updatedAt: now(),
        result: { recordsProcessed: Math.floor(Math.random() * 1000) + 100, success: true },
      }
      this._save(data)
      return data[idx]
    },
    delete(id: string): boolean {
      const data = this._data()
      const next = data.filter(j => j.id !== id)
      if (next.length === data.length) return false
      this._save(next)
      return true
    },
  },

  formConfigs: {
    _data: (): SavedFormConfig[] => loadOrInit<SavedFormConfig>(KEYS.formConfigs, []),
    _save(data: SavedFormConfig[]) { persist(KEYS.formConfigs, data) },

    getAll(): SavedFormConfig[] { return this._data() },
    getById(id: string): SavedFormConfig | undefined { return this._data().find(f => f.id === id) },
    create(req: Omit<SavedFormConfig, 'id' | 'createdAt' | 'updatedAt'>): SavedFormConfig {
      const data = this._data()
      const item: SavedFormConfig = { ...req, id: genId(), createdAt: now(), updatedAt: now() }
      data.push(item)
      this._save(data)
      return item
    },
    update(id: string, req: Partial<SavedFormConfig>): SavedFormConfig | undefined {
      const data = this._data()
      const idx = data.findIndex(f => f.id === id)
      if (idx === -1) return undefined
      data[idx] = { ...data[idx], ...req, id, updatedAt: now() }
      this._save(data)
      return data[idx]
    },
    delete(id: string): boolean {
      const data = this._data()
      const next = data.filter(f => f.id !== id)
      if (next.length === data.length) return false
      this._save(next)
      return true
    },
  },

  formMappings: {
    _data: (): AlertFormMapping[] => loadOrInit<AlertFormMapping>(KEYS.formMappings, []),
    _save(data: AlertFormMapping[]) { persist(KEYS.formMappings, data) },

    getAll(): AlertFormMapping[] { return this._data() },
    create(req: { alertType: string; sourceType: string; formId: string }): AlertFormMapping {
      const data = this._data()
      const existing = data.findIndex(m => m.alertType === req.alertType && m.sourceType === req.sourceType)
      const item: AlertFormMapping = { id: genId(), ...req, createdAt: now() }
      if (existing !== -1) { data[existing] = item } else { data.push(item) }
      this._save(data)
      return item
    },
    delete(id: string): boolean {
      const data = this._data()
      const next = data.filter(m => m.id !== id)
      if (next.length === data.length) return false
      this._save(next)
      return true
    },
    resolve(alertType: string, sourceType: string): SavedFormConfig | undefined {
      const mapping = this._data().find(m => m.alertType === alertType && m.sourceType === sourceType)
      if (!mapping) return undefined
      return db.formConfigs.getById(mapping.formId)
    },
  },

  scenarios: {
    _data: (): Scenario[] => seedOnce<Scenario>(SEED_FLAGS.scenarios, KEYS.scenarios, INITIAL_SCENARIOS),
    _save(data: Scenario[]) { persist(KEYS.scenarios, data) },

    getAll(): Scenario[] { return this._data() },
    getById(id: string): Scenario | undefined { return this._data().find(s => s.id === id) },
    create(req: Omit<Scenario, 'id' | 'createdAt'>): Scenario {
      const data = this._data()
      const item: Scenario = { ...req, id: genId(), createdAt: now() }
      data.push(item)
      this._save(data)
      return item
    },
    update(id: string, req: Partial<Scenario>): Scenario | undefined {
      const data = this._data()
      const idx = data.findIndex(s => s.id === id)
      if (idx === -1) return undefined
      data[idx] = { ...data[idx], ...req, id }
      this._save(data)
      return data[idx]
    },
    delete(id: string): boolean {
      const data = this._data()
      const next = data.filter(s => s.id !== id)
      if (next.length === data.length) return false
      this._save(next)
      return true
    },
  },

  simLogs: {
    _data: (): SimulationLog[] => loadOrInit<SimulationLog>(KEYS.simLogs, []),
    _save(data: SimulationLog[]) { persist(KEYS.simLogs, data) },

    getRecent(): SimulationLog[] { return this._data().slice(-50).reverse() },
    add(log: SimulationLog): void {
      const data = this._data()
      data.push(log)
      if (data.length > 200) data.splice(0, data.length - 200)
      this._save(data)
    },
  },
}
