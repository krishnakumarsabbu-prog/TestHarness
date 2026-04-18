import { PageContainer, SectionCard } from '../components/ui'

function Transactions() {
  return (
    <PageContainer title="Transactions" subtitle="View and manage transaction records.">
      <SectionCard>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">No transactions yet</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Transaction records will appear here once data is available.</p>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  )
}

export default Transactions
