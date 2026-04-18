import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, SectionCard, Button } from '../components/ui'
import AlertMetadata from '../components/alerts/AlertMetadata'
import DynamicFormBuilder from '../components/alerts/DynamicFormBuilder'
import ConfigurationPreview from '../components/alerts/ConfigurationPreview'
import DynamicFormRenderer from '../components/alerts/DynamicFormRenderer'
import type { AlertConfig, AlertField } from '../components/alerts/types'
import { loadFormConfigs, loadActiveFormId } from '../store/formConfigStore'

const DEFAULT_METADATA: AlertConfig['metadata'] = {
  alertName: '',
  alertType: '',
  sourceType: '',
  version: '',
  description: '',
}

function AlertsOnboarding() {
  const navigate = useNavigate()

  const activeFormId = loadActiveFormId()
  const configs = loadFormConfigs()
  const activeForm = activeFormId ? configs.find(c => c.id === activeFormId) ?? null : null

  const [metadata, setMetadata] = useState<AlertConfig['metadata']>(DEFAULT_METADATA)
  const [fields, setFields] = useState<AlertField[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [cloned, setCloned] = useState(false)

  const config: AlertConfig = { metadata, fields }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!metadata.alertName.trim()) errs.alertName = 'Alert Name is required'
    if (!metadata.alertType) errs.alertType = 'Alert Type is required'
    if (!metadata.sourceType) errs.sourceType = 'Source Type is required'
    if (!metadata.version) errs.version = 'Version is required'
    fields.forEach((f, i) => {
      if (!f.fieldName.trim()) errs[`field_${i}_name`] = 'Field name is required'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setErrors({})
    setSaved(true)
    setCloned(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClone = () => {
    setMetadata(prev => ({
      ...prev,
      alertName: prev.alertName ? `${prev.alertName} (Copy)` : 'Untitled (Copy)',
    }))
    setCloned(true)
    setSaved(false)
    setTimeout(() => setCloned(false), 3000)
  }

  const handleReset = () => {
    setMetadata(DEFAULT_METADATA)
    setFields([])
    setErrors({})
    setSaved(false)
    setCloned(false)
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <PageContainer
      title="Alerts Onboarding"
      subtitle="Define and configure new alert types with dynamic field schemas."
    >
      <div className="flex flex-col gap-6">
        {activeForm ? (
          <>
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-primary-50 border border-primary-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-sm text-primary-700">
                  Showing active form: <span className="font-semibold">{activeForm.name}</span>
                  <span className="ml-2 text-primary-500 text-xs">{activeForm.fields.length} field{activeForm.fields.length !== 1 ? 's' : ''}</span>
                </p>
              </div>
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

            <DynamicFormRenderer config={activeForm} />
          </>
        ) : (
          <>
            {saved && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success-50 border border-success-100 text-success-600 text-sm font-medium fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Configuration saved successfully.
              </div>
            )}

            {cloned && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                Configuration cloned. Update the name and save.
              </div>
            )}

            {hasErrors && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-danger-50 border border-danger-100 text-danger-600 text-sm fade-in">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="font-medium">Please fix the following errors:</p>
                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-xs text-danger-500">
                    {Object.values(errors).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <SectionCard>
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-slate-700">No active form configured</p>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    Go to Settings to create a dynamic form, then activate it to display it here.
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => navigate('/settings')}>
                  Configure in Settings
                </Button>
              </div>
            </SectionCard>

            <AlertMetadata metadata={metadata} onChange={setMetadata} errors={errors} />

            <DynamicFormBuilder fields={fields} onChange={setFields} errors={errors} />

            <ConfigurationPreview config={config} />

            <SectionCard
              title="Actions"
              description="Save or manage this alert configuration."
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  }
                >
                  Save Configuration
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClone}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                  }
                >
                  Clone Configuration
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  }
                >
                  Reset
                </Button>
              </div>
            </SectionCard>
          </>
        )}
      </div>
    </PageContainer>
  )
}

export default AlertsOnboarding
