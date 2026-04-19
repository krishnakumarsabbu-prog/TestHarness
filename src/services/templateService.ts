import { db } from '../store/memoryDb'
import type { AlertTemplate } from '../store/memoryDb'

export type { AlertTemplate }

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
  getAll: (filters: TemplateFilters = {}): Promise<AlertTemplate[]> =>
    Promise.resolve(db.templates.getAll(filters)),

  getById: (id: string): Promise<AlertTemplate | undefined> =>
    Promise.resolve(db.templates.getById(id)),

  create: (req: TemplateRequest): Promise<AlertTemplate> =>
    Promise.resolve(
      db.templates.create({
        name: req.name,
        channel: req.channel,
        language: req.language || 'en',
        version: req.version,
        subject: req.subject || '',
        body: req.body || '',
        htmlTemplate: req.htmlTemplate || '',
        variables: req.variables || [],
        status: req.status || 'active',
        metadata: req.metadata || {},
      })
    ),

  update: (id: string, req: TemplateRequest): Promise<AlertTemplate | undefined> =>
    Promise.resolve(db.templates.update(id, req)),

  delete: (id: string): Promise<void> => {
    db.templates.delete(id)
    return Promise.resolve()
  },
}
