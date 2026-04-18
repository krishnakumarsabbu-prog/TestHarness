import { useEffect } from 'react'
import type { Transaction } from './mockData'

interface TransactionDetailDrawerProps {
  transaction: Transaction | null
  onClose: () => void
}

const statusConfig = {
  Success: { label: 'Success', dot: 'bg-success-500', text: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200' },
  Failed: { label: 'Failed', dot: 'bg-danger-500', text: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-200' },
  Pending: { label: 'Pending', dot: 'bg-warning-500', text: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200' },
}

const logLevelConfig = {
  INFO: { text: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-100' },
  DEBUG: { text: 'text-slate-600', bg: 'bg-surface-100', border: 'border-surface-200' },
  WARN: { text: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-100' },
  ERROR: { text: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-100' },
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-surface-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <span className="text-sm text-slate-700 text-right font-medium">{value}</span>
    </div>
  )
}

function TransactionDetailDrawer({ transaction, onClose }: TransactionDetailDrawerProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (transaction) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [transaction, onClose])

  if (!transaction) return null

  const status = statusConfig[transaction.status]

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.15s ease-out both' }}
      />

      <div
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-soft-lg z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.2s cubic-bezier(0.4,0,0.2,1) both' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{transaction.alertName}</p>
              <p className="text-xs text-slate-400 font-mono">{transaction.messageId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-surface-100 transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Lifecycle</h3>
              <div className="bg-surface-50 rounded-xl border border-surface-200 px-4">
                <DetailRow label="Trigger Source" value={transaction.triggerSource} />
                <DetailRow label="Inbound Source" value={transaction.inboundSource} />
                <DetailRow label="Message Key Type" value={<span className="font-mono text-xs bg-surface-200 px-2 py-0.5 rounded">{transaction.messageKeyType}</span>} />
                <DetailRow label="Message Value" value={<span className="font-mono text-xs">{transaction.messageValue}</span>} />
                <DetailRow label="Template Used" value={<span className="font-mono text-xs">{transaction.templateUsed}</span>} />
                <DetailRow label="Channel" value={transaction.channel} />
                <DetailRow label="Delivery Status" value={transaction.deliveryStatus} />
                <DetailRow label="Created Time" value={formatDate(transaction.createdTime)} />
                <DetailRow label="Processing Time" value={`${transaction.processingTimeMs.toLocaleString()} ms`} />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payload</h3>
              <div className="bg-slate-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
                  <span className="text-xs text-slate-400 font-mono">JSON</span>
                  <button
                    onClick={() => navigator.clipboard?.writeText(JSON.stringify(transaction.payload, null, 2))}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy
                  </button>
                </div>
                <pre className="px-4 py-3 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto">
                  {JSON.stringify(transaction.payload, null, 2)}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Execution Logs</h3>
              <div className="space-y-2">
                {transaction.logs.map((log, idx) => {
                  const cfg = logLevelConfig[log.level]
                  return (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider shrink-0 mt-0.5 ${cfg.text}`} style={{ minWidth: '3rem' }}>
                        {log.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${cfg.text}`}>{log.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export default TransactionDetailDrawer
