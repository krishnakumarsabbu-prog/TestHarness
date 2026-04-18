import type { Transaction, TransactionStatus } from './mockData'

type SortField = 'messageId' | 'alertName' | 'channel' | 'status' | 'createdTime' | 'processingTimeMs'
type SortDir = 'asc' | 'desc'

interface TransactionsTableProps {
  data: Transaction[]
  loading: boolean
  page: number
  pageSize: number
  totalCount: number
  sortField: SortField
  sortDir: SortDir
  onPageChange: (page: number) => void
  onSort: (field: SortField) => void
  onRowClick: (tx: Transaction) => void
}

const statusConfig: Record<TransactionStatus, { dot: string; text: string; bg: string; border: string }> = {
  Success: { dot: 'bg-success-500', text: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200' },
  Failed: { dot: 'bg-danger-500', text: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-200' },
  Pending: { dot: 'bg-warning-500', text: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200' },
}

const channelConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  Email: {
    bg: 'bg-primary-50 text-primary-700',
    text: 'text-primary-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  SMS: {
    bg: 'bg-success-50 text-success-700',
    text: 'text-success-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  Push: {
    bg: 'bg-warning-50 text-warning-700',
    text: 'text-warning-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
  },
  Webhook: {
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
  Slack: {
    bg: 'bg-danger-50 text-danger-700',
    text: 'text-danger-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  const active = field === sortField
  return (
    <span className={`ml-1 inline-flex flex-col gap-0.5 ${active ? 'opacity-100' : 'opacity-30'}`}>
      <svg
        className={`w-2.5 h-2.5 ${active && sortDir === 'asc' ? 'text-primary-600' : 'text-slate-400'}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0L5 0Z" />
      </svg>
      <svg
        className={`w-2.5 h-2.5 ${active && sortDir === 'desc' ? 'text-primary-600' : 'text-slate-400'}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0H10L5 6Z" />
      </svg>
    </span>
  )
}

function TransactionsTable({
  data,
  loading,
  page,
  pageSize,
  totalCount,
  sortField,
  sortDir,
  onPageChange,
  onSort,
  onRowClick,
}: TransactionsTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const start = Math.min((page - 1) * pageSize + 1, totalCount)
  const end = Math.min(page * pageSize, totalCount)

  const columns: { label: string; field?: SortField; width?: string }[] = [
    { label: 'Message ID', field: 'messageId', width: '16%' },
    { label: 'Alert Name', field: 'alertName', width: '22%' },
    { label: 'Channel', field: 'channel', width: '10%' },
    { label: 'Status', field: 'status', width: '10%' },
    { label: 'Created Time', field: 'createdTime', width: '18%' },
    { label: 'Processing Time', field: 'processingTimeMs', width: '14%' },
    { label: '', width: '4%' },
  ]

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-x-auto rounded-2xl border border-surface-200 shadow-soft">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              {columns.map((col) => (
                <th
                  key={col.label || 'actions'}
                  style={{ width: col.width }}
                  className="px-4 py-3 text-left"
                >
                  {col.field ? (
                    <button
                      onClick={() => onSort(col.field!)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.field} sortField={sortField} sortDir={sortDir} />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-100">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} style={{ opacity: 1 - i * 0.1 }}>
                  {columns.map((col) => (
                    <td key={col.label || 'a'} className="px-4 py-3.5">
                      <div className="skeleton-shimmer h-4 rounded-lg" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">No transactions found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search criteria</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((tx) => {
                const s = statusConfig[tx.status]
                const ch = channelConfig[tx.channel] || channelConfig['Webhook']
                const isFailed = tx.status === 'Failed'
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onRowClick(tx)}
                    className={`cursor-pointer transition-colors duration-100 group ${
                      isFailed
                        ? 'bg-danger-50/40 hover:bg-danger-50/70'
                        : 'hover:bg-surface-50/80'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-600 bg-surface-100 px-2 py-0.5 rounded">{tx.messageId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">{tx.alertName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium ${ch.bg}`}>
                        {ch.icon}
                        {tx.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(tx.createdTime)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium tabular-nums ${tx.processingTimeMs > 3000 ? 'text-warning-600' : 'text-slate-600'}`}>
                        {tx.processingTimeMs.toLocaleString()} ms
                        {tx.processingTimeMs > 3000 && (
                          <span className="ml-1 text-warning-500" title="SLA breach">!</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <div className="flex items-center justify-between px-1 pt-3">
          <p className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-600">{start}–{end}</span> of <span className="font-medium text-slate-600">{totalCount}</span> transactions
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                acc.push(p)
                return acc
              }, [])
              .map((item, idx) =>
                item === 'ellipsis' ? (
                  <span key={`e-${idx}`} className="px-2 text-slate-400 text-sm">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => onPageChange(item)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      item === page
                        ? 'bg-primary-600 text-white shadow-soft-sm'
                        : 'text-slate-500 hover:bg-surface-100 hover:text-slate-800'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
