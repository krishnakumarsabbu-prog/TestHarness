import { db } from '../store/memoryDb'
import type { BatchJob } from '../store/memoryDb'

export type { BatchJob }

export interface BatchJobRequest {
  name: string
  type?: string
  config?: Record<string, unknown>
}

export const batchJobService = {
  getAll: (): Promise<BatchJob[]> =>
    Promise.resolve(db.batchJobs.getAll()),

  getById: (id: string): Promise<BatchJob | undefined> =>
    Promise.resolve(db.batchJobs.getById(id)),

  create: (req: BatchJobRequest): Promise<BatchJob> =>
    Promise.resolve(db.batchJobs.create(req)),

  execute: (id: string): Promise<BatchJob | undefined> =>
    Promise.resolve(db.batchJobs.execute(id)),

  delete: (id: string): Promise<void> => {
    db.batchJobs.delete(id)
    return Promise.resolve()
  },
}
