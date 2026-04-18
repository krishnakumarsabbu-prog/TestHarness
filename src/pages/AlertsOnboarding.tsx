import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, SectionCard, Button } from '../components/ui'
import DynamicFormRenderer from '../components/alerts/DynamicFormRenderer'
import { loadFormConfigs, loadActiveFormId } from '../store/formConfigStore'
import type { SavedFormConfig } from '../store/formConfigStore'

function AlertsOnboarding() {
  const navigate = useNavigate()

  const configs = loadFormConfigs()
  const defaultActiveId = loadActiveFormId()
  const defaultForm = defaultActiveId ? configs.find(c => c.id === defaultActiveId) ?? null : null

  const [selectedForm, setSelectedForm] = useState<SavedFormConfig | null>(defaultForm)

  const handleFormChange = (id: string) => {
    if (!id) {
      setSelectedForm(null)
      return
    }
    const form = configs.find(c => c.id === id) ?? null
    setSelectedForm(form)
  }

  return (
    <PageContainer
      title="Alerts Onboarding"
      subtitle="Select a form and fill in the alert details below."
    >
      <div className="flex flex-col gap-6">
        <SectionCard
          title="Select Form"
          description="Choose a form template created in Settings to fill out."
        >
          {configs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="w-11 h-11 rounded-2xl bg-surface-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">No forms available</p>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Create a form in Settings first, then come back to fill it out here.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/settings')}>
                Go to Settings
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Form Template
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                    value={selectedForm?.id ?? ''}
                    onChange={e => handleFormChange(e.target.value)}
                  >
                    <option value="">-- Select a form --</option>
                    {configs.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.description ? ` — ${c.description}` : ''}
                        {` (${c.fields.length} field${c.fields.length !== 1 ? 's' : ''})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/settings')}
                    icon={
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  >
                    Manage Forms
                  </Button>
                </div>
              </div>

              {selectedForm && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 border border-primary-100">
                  <svg className="w-3.5 h-3.5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-primary-700">
                    <span className="font-semibold">{selectedForm.name}</span>
                    {selectedForm.description && (
                      <span className="text-primary-500 ml-1">— {selectedForm.description}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {selectedForm && selectedForm.fields.length > 0 && (
          <DynamicFormRenderer config={selectedForm} />
        )}

        {selectedForm && selectedForm.fields.length === 0 && (
          <SectionCard>
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">This form has no fields yet</p>
                <p className="text-xs text-slate-400">Add fields to this form in Settings to render them here.</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => navigate('/settings')}>
                Edit Form in Settings
              </Button>
            </div>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  )
}

export default AlertsOnboarding
