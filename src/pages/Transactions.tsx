import { useState, useMemo, useCallback, useEffect } from 'react'
import { PageContainer, SectionCard } from '../components/ui'
import TransactionFilters, { DEFAULT_FILTERS, type FilterState } from './transactions/TransactionFilters'
import MetricCards from './transactions/MetricCards'
import TransactionsTable from './transactions/TransactionsTable'
import TransactionDetailDrawer from './transactions/TransactionDetailDrawer'
import { MOCK_TRANSACTIONS, type Transaction } from './transactions/mockData'

type SortField = 'messageId' | 'alertName' | 'channel' | 'status' | 'createdTime' | 'processingTimeMs'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

function Transactions() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('createdTime')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const handleSearch = useCallback(() => {
    setActiveFilters(filters)
    setPage(1)
  }, [filters])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setActiveFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [])

  const handleSort = useCallback((field: SortField) => {
    setSortDir((prev) => (field === sortField ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'))
    setSortField(field)
    setPage(1)
  }, [sortField])

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      if (activeFilters.inboundSource && tx.inboundSource !== activeFilters.inboundSource) return false
      if (activeFilters.messageKeyType && tx.messageKeyType !== activeFilters.messageKeyType) return false
      if (activeFilters.messageValue && !tx.messageValue.toLowerCase().includes(activeFilters.messageValue.toLowerCase())) return false
      if (activeFilters.channels.length > 0 && !activeFilters.channels.includes(tx.channel)) return false
      if (activeFilters.dateFrom) {
        const from = new Date(activeFilters.dateFrom)
        if (new Date(tx.createdTime) < from) return false
      }
      if (activeFilters.dateTo) {
        const to = new Date(activeFilters.dateTo)
        to.setHours(23, 59, 59, 999)
        if (new Date(tx.createdTime) > to) return false
      }
      return true
    })
  }, [activeFilters])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortField === 'createdTime') {
        cmp = new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
      } else if (sortField === 'processingTimeMs') {
        cmp = a.processingTimeMs - b.processingTimeMs
      } else {
        cmp = String(a[sortField]).localeCompare(String(b[sortField]))
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortField, sortDir])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return sorted.slice(start, start + PAGE_SIZE)
  }, [sorted, page])

  const metrics = useMemo(() => {
    const success = filtered.filter((t) => t.status === 'Success').length
    const failed = filtered.filter((t) => t.status === 'Failed').length
    const slaBreaches = filtered.filter((t) => t.processingTimeMs > 3000).length
    return { total: filtered.length, success, failed, slaBreaches }
  }, [filtered])

  return (
    <PageContainer
      title="Alert Transactions"
      subtitle="Monitor and analyze alert execution history across all channels."
    >
      <div className="flex flex-col gap-6">
        <TransactionFilters
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <MetricCards
          total={metrics.total}
          success={metrics.success}
          failed={metrics.failed}
          slaBreaches={metrics.slaBreaches}
          loading={loading}
        />

        <SectionCard>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Transaction Log</h2>
              <p className="text-xs text-slate-400 mt-0.5">Click any row to view the full execution details</p>
            </div>
            {!loading && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-danger-50 rounded-xl border border-danger-100">
                  <span className="w-2 h-2 rounded-full bg-danger-500" />
                  <span className="text-xs font-medium text-danger-700">{metrics.failed} Failed</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-50 rounded-xl border border-warning-100">
                  <span className="w-2 h-2 rounded-full bg-warning-500" />
                  <span className="text-xs font-medium text-warning-700">{metrics.slaBreaches} SLA Breaches</span>
                </div>
              </div>
            )}
          </div>

          <TransactionsTable
            data={paginated}
            loading={loading}
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={sorted.length}
            sortField={sortField}
            sortDir={sortDir}
            onPageChange={setPage}
            onSort={handleSort}
            onRowClick={setSelectedTx}
          />
        </SectionCard>
      </div>

      <TransactionDetailDrawer
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </PageContainer>
  )
}

export default Transactions
