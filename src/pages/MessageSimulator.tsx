import { PageContainer, SectionCard } from '../components/ui'

function MessageSimulator() {
  return (
    <PageContainer title="Message Simulator" subtitle="Simulate and test message flows.">
      <SectionCard>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">No simulations yet</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Configure and run message simulations to test your alert flows.</p>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  )
}

export default MessageSimulator
