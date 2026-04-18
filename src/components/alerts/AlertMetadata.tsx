import { SectionCard, FormField } from '../ui'
import type { AlertMetadataValues } from './types'

const ALERT_TYPES = ['Fraud', 'Risk', 'Compliance', 'Operational', 'Security', 'Performance']
const SOURCE_TYPES = ['Kafka', 'MQ', 'WebService', 'Batch']
const VERSIONS = ['v1.0', 'v1.1', 'v2.0', 'v2.1', 'v3.0']

interface Props {
  metadata: AlertMetadataValues
  onChange: (meta: AlertMetadataValues) => void
  errors: Record<string, string>
}

function AlertMetadata({ metadata, onChange, errors }: Props) {
  const set = (key: keyof AlertMetadataValues, value: string) =>
    onChange({ ...metadata, [key]: value })

  return (
    <SectionCard
      title="Alert Metadata"
      description="Basic information and classification for this alert type."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Alert Name"
          required
          placeholder="e.g. High Value Transaction Alert"
          value={metadata.alertName}
          error={errors.alertName}
          onChange={e => set('alertName', e.target.value)}
        />
        <FormField
          as="select"
          label="Alert Type"
          required
          value={metadata.alertType}
          error={errors.alertType}
          onChange={e => set('alertType', e.target.value)}
        >
          <option value="">Select alert type</option>
          {ALERT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </FormField>
        <FormField
          as="select"
          label="Source Type"
          required
          value={metadata.sourceType}
          error={errors.sourceType}
          onChange={e => set('sourceType', e.target.value)}
        >
          <option value="">Select source type</option>
          {SOURCE_TYPES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </FormField>
        <FormField
          as="select"
          label="Version"
          required
          value={metadata.version}
          error={errors.version}
          onChange={e => set('version', e.target.value)}
        >
          <option value="">Select version</option>
          {VERSIONS.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </FormField>
        <div className="sm:col-span-2">
          <FormField
            as="textarea"
            label="Description"
            rows={3}
            placeholder="Describe the purpose and behavior of this alert..."
            value={metadata.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>
      </div>
    </SectionCard>
  )
}

export default AlertMetadata
