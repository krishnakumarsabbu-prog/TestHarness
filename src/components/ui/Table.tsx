import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  loading?: boolean
  emptyMessage?: string
  page?: number
  pageSize?: number
  totalCount?: number
  onPageChange?: (page: number) => void
}

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = 'No data available',
  page = 1,
  pageSize = 10,
  totalCount,
  onPageChange,
}: TableProps<T>) {
  const total = totalCount ?? data.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showPagination = onPageChange !== undefined || total > pageSize

  const alignClass: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-x-auto rounded-xl border border-surface-200 shadow-soft">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-100 border-b border-surface-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-2.5 font-semibold text-warm-500 text-xs uppercase tracking-wider ${alignClass[col.align ?? 'left']}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-ivory divide-y divide-surface-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ opacity: 1 - i * 0.12 }}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div className="skeleton-shimmer h-4 rounded-lg" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[keyField])}
                  className="hover:bg-surface-100/60 transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 text-warm-800 text-sm ${alignClass[col.align ?? 'left']}`}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-1 pt-3">
          <p className="text-xs text-warm-400">
            Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
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
                    onClick={() => onPageChange?.(item)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                      item === page
                        ? 'bg-primary-500 text-white shadow-soft-sm'
                        : 'text-warm-500 hover:bg-surface-100 hover:text-warm-800'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
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

export default Table
