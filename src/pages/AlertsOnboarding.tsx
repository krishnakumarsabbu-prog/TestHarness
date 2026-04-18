import { useState } from 'react'
import { PageContainer, SectionCard, Button } from '../components/ui'
import AlertMetadata from '../components/alerts/AlertMetadata'
import DynamicFormBuilder from '../components/alerts/DynamicFormBuilder'
import ConfigurationPreview from '../components/alerts/ConfigurationPreview'
import type { AlertConfig, AlertField } from '../components/alerts/types'

const DEFAULT_METADATA: AlertConfig['metadata'] = {
  alertName: '',
  alertType: '',
  sourceType: '',
  version: '',
  description: '',
}

function AlertsOnboarding() {
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
      </div>
    </PageContainer>
  )
}

export default AlertsOnboarding
