import { useState, useEffect, useCallback } from 'react'
import { PageContainer, SectionCard, Button } from '../components/ui'
import { batchJobService, type BatchJob } from '../services/batchJobService'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  running: 'bg-blue-50 text-blue-700',
  completed: 'bg-success-50 text-success-700',
  failed: 'bg-danger-50 text-danger-700',
}

function BatchProcessing() {
  const [jobs, setJobs] = useState<BatchJob[]>([])
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState<string | null>(null)
  const [newJobName, setNewJobName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const fetchJobs = useCallback(async () => {
    try {
      const data = await batchJobService.getAll()
      setJobs(data)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleExecute = async (id: string) => {
    setExecuting(id)
    try {
      const updated = await batchJobService.execute(id)
      setJobs(prev => prev.map(j => j.id === id ? (updated ?? j) : j))
    } catch {
    } finally {
      setExecuting(null)
    }
  }

  const handleCreate = async () => {
    if (!newJobName.trim()) return
    setCreating(true)
    try {
      const job = await batchJobService.create({ name: newJobName.trim(), type: 'standard' })
      setJobs(prev => [job, ...prev])
      setNewJobName('')
      setShowCreate(false)
    } catch {
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await batchJobService.delete(id)
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch {}
  }

  return (
    <PageContainer title="Batch Processing" subtitle="Monitor and trigger batch jobs.">
      <div className="flex flex-col gap-6">
        <SectionCard
          title="Batch Jobs"
          description="Create and execute batch processing jobs."
          actions={
            <Button size="sm" onClick={() => setShowCreate(v => !v)}
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
            >
              New Job
            </Button>
          }
        >
          {showCreate && (
            <div className="flex items-center gap-3 mb-5 p-4 bg-surface-50 rounded-xl border border-surface-200">
              <input
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                placeholder="Job name…"
                value={newJobName}
                onChange={e => setNewJobName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
              <Button size="sm" onClick={handleCreate} loading={creating} disabled={creating || !newJobName.trim()}>
                Create
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-shimmer h-14 rounded-xl" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-700">No batch jobs yet</p>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Click "New Job" to create your first batch processing job.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {jobs.map(job => (
                <div key={job.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{job.name}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] || 'bg-slate-100 text-slate-600'}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {job.type} · Created {new Date(job.createdAt).toLocaleDateString()}
                      {job.completedAt && ` · Completed ${new Date(job.completedAt).toLocaleString()}`}
                    </p>
                    {job.errorMessage && (
                      <p className="text-xs text-danger-600 mt-0.5">{job.errorMessage}</p>
                    )}
                    {job.result && Object.keys(job.result).length > 0 && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {JSON.stringify(job.result)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(job.status === 'pending' || job.status === 'failed') && (
                      <Button
                        size="sm"
                        onClick={() => handleExecute(job.id)}
                        loading={executing === job.id}
                        disabled={executing !== null}
                      >
                        Execute
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(job.id)}
                      icon={<svg className="w-3.5 h-3.5 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </PageContainer>
  )
}

export default BatchProcessing
