import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, SectionCard, Button } from '../components/ui'
import AlertMetadata from '../components/alerts/AlertMetadata'
import DynamicFormRenderer from '../components/alerts/DynamicFormRenderer'
import { getFormForAlert } from '../store/formConfigStore'
import type { AlertMetadataValues } from '../components/alerts/types'
import type { SavedFormConfig } from '../store/formConfigStore'

const emptyMeta = (): AlertMetadataValues => ({
  alertName: '',
  alertType: '',
  sourceType: '',
  version: '',
  description: '',
})

function validateMeta(meta: AlertMetadataValues): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!meta.alertName.trim()) errs.alertName = 'Alert name is required'
  if (!meta.alertType) errs.alertType = 'Alert type is required'
  if (!meta.sourceType) errs.sourceType = 'Source type is required'
  if (!meta.version) errs.version = 'Version is required'
  return errs
}

function AlertsOnboarding() {
  const navigate = useNavigate()
  const [metadata, setMetadata] = useState<AlertMetadataValues>(emptyMeta())
  const [metaErrors, setMetaErrors] = useState<Record<string, string>>({})
  const [resolvedForm, setResolvedForm] = useState<SavedFormConfig | null>(null)
  const [noMapping, setNoMapping] = useState(false)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (metadata.alertType && metadata.sourceType) {
      const form = getFormForAlert(metadata.alertType, metadata.sourceType)
      setResolvedForm(form)
      setNoMapping(!form)
    } else {
      setResolvedForm(null)
      setNoMapping(false)
    }
    setFormKey(k => k + 1)
  }, [metadata.alertType, metadata.sourceType])

  const handleMetaChange = (meta: AlertMetadataValues) => {
    setMetadata(meta)
    if (Object.keys(metaErrors).length > 0) {
      const errs = validateMeta(meta)
      setMetaErrors(errs)
    }
  }

  return (
    <PageContainer
      title="Alerts Onboarding"
      subtitle="Fill in the alert metadata and complete the dynamic form to onboard a new alert."
    >
      <div className="flex flex-col gap-6">
        <AlertMetadata
          metadata={metadata}
          onChange={handleMetaChange}
          errors={metaErrors}
        />

        {metadata.alertType && metadata.sourceType && noMapping && (
          <SectionCard title="Dynamic Form">
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-700">No form mapped</p>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  No form has been configured for <span className="font-medium text-slate-600">{metadata.alertType}</span> + <span className="font-medium text-slate-600">{metadata.sourceType}</span>. Go to Settings to create a mapping.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/settings')}>
                Configure in Settings
              </Button>
            </div>
          </SectionCard>
        )}

        {resolvedForm && resolvedForm.fields.length > 0 && (
          <DynamicFormRenderer key={formKey} config={resolvedForm} />
        )}

        {resolvedForm && resolvedForm.fields.length === 0 && (
          <SectionCard title="Dynamic Form">
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Mapped form has no fields</p>
                <p className="text-xs text-slate-400">Add fields to the mapped form in Settings.</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => navigate('/settings')}>
                Edit in Settings
              </Button>
            </div>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  )
}

export default AlertsOnboarding
