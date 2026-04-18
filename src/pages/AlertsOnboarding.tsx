import { PageContainer, SectionCard } from '../components/ui'

function AlertsOnboarding() {
  return (
    <PageContainer title="Alerts Onboarding" subtitle="Onboard users to the alerts system.">
      <SectionCard>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">No onboarding flows yet</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">User onboarding flows and enrollment records will be displayed here.</p>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  )
}

export default AlertsOnboarding
