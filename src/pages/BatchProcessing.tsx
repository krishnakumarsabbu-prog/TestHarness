import { PageContainer, SectionCard } from '../components/ui'

function BatchProcessing() {
  return (
    <PageContainer title="Batch Processing" subtitle="Monitor and trigger batch jobs.">
      <SectionCard>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">No batch jobs running</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Batch job status and processing history will appear here.</p>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  )
}

export default BatchProcessing
