import { useState, useCallback, useEffect } from 'react'
import { PageContainer, SectionCard } from '../components/ui'
import TransactionFilters, { DEFAULT_FILTERS, type FilterState } from './transactions/TransactionFilters'
import MetricCards from './transactions/MetricCards'
import TransactionsTable from './transactions/TransactionsTable'
import TransactionDetailDrawer from './transactions/TransactionDetailDrawer'
import { MOCK_TRANSACTIONS, type Transaction } from './transactions/mockData'
import { transactionService, type TransactionMetrics } from '../services/transactionService'

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
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [metrics, setMetrics] = useState<TransactionMetrics>({ total: 0, success: 0, failed: 0, pending: 0, slaBreaches: 0 })
  const [apiAvailable, setApiAvailable] = useState(true)

  const loadMockData = useCallback((pg: number) => {
    const start = (pg - 1) * PAGE_SIZE
    setTransactions(MOCK_TRANSACTIONS.slice(start, start + PAGE_SIZE) as unknown as Transaction[])
    setTotalCount(MOCK_TRANSACTIONS.length)
    const total = MOCK_TRANSACTIONS.length
    const success = MOCK_TRANSACTIONS.filter(t => t.status === 'Success').length
    const failed = MOCK_TRANSACTIONS.filter(t => t.status === 'Failed').length
    const pending = MOCK_TRANSACTIONS.filter(t => t.status === 'Pending').length
    const slaBreaches = MOCK_TRANSACTIONS.filter(t => t.processingTimeMs > 3000).length
    setMetrics({ total, success, failed, pending, slaBreaches })
  }, [])

  const fetchData = useCallback(async (f: FilterState, pg: number, sf: SortField, sd: SortDir) => {
    setLoading(true)
    try {
      const [result, m] = await Promise.all([
        transactionService.getAll({
          inboundSource: f.inboundSource || undefined,
          messageKeyType: f.messageKeyType || undefined,
          channel: f.channels.length === 1 ? f.channels[0] : undefined,
          dateFrom: f.dateFrom ? new Date(f.dateFrom).toISOString() : undefined,
          dateTo: f.dateTo ? new Date(f.dateTo + 'T23:59:59').toISOString() : undefined,
          page: pg - 1,
          size: PAGE_SIZE,
          sortBy: sf,
          sortDir: sd,
        }),
        transactionService.getMetrics(),
      ])
      setTransactions(result.content as unknown as Transaction[])
      setTotalCount(result.totalElements)
      setMetrics(m)
      setApiAvailable(true)
    } catch {
      setApiAvailable(false)
      loadMockData(pg)
    } finally {
      setLoading(false)
    }
  }, [loadMockData])

  useEffect(() => {
    fetchData(activeFilters, page, sortField, sortDir)
  }, [activeFilters, page, sortField, sortDir, fetchData])

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

  return (
    <PageContainer
      title="Alert Transactions"
      subtitle={`Monitor and analyze alert execution history across all channels.${!apiAvailable ? ' (showing demo data)' : ''}`}
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
            data={transactions}
            loading={loading}
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
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
