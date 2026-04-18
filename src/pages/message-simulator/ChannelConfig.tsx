import type { ChannelType, ChannelConfig, PayloadFormat } from './types'
import {
  ENVIRONMENTS,
  KAFKA_TOPICS,
  MQ_QUEUES,
  WEB_SERVICES,
} from './mockData'

interface ChannelConfigPanelProps {
  channel: ChannelType
  config: ChannelConfig
  onChange: (config: ChannelConfig) => void
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all font-mono placeholder:font-sans placeholder:text-slate-400"
      />
    </div>
  )
}

function ChannelConfigPanel({ channel, config, onChange }: ChannelConfigPanelProps) {
  const envOptions = ENVIRONMENTS.map((e) => ({ value: e.id, label: e.label }))
  const formatOptions: { value: PayloadFormat; label: string }[] = [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
  ]

  const selectedEnv = ENVIRONMENTS.find((e) => e.id === config.environment)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Environment"
          value={config.environment}
          options={envOptions}
          onChange={(environment) => onChange({ ...config, environment })}
        />
        <SelectField
          label="Payload Format"
          value={config.format}
          options={formatOptions}
          onChange={(format) => onChange({ ...config, format: format as PayloadFormat })}
        />
      </div>

      {selectedEnv && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-50 border border-surface-200">
          <div className="w-2 h-2 rounded-full bg-success-500 shrink-0" />
          <span className="text-xs text-slate-500 font-mono">{selectedEnv.url}</span>
        </div>
      )}

      {channel === 'kafka' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <SelectField
              label="Topic"
              value={config.kafka?.topic ?? KAFKA_TOPICS[0]}
              options={KAFKA_TOPICS.map((t) => ({ value: t, label: t }))}
              onChange={(topic) =>
                onChange({ ...config, kafka: { ...config.kafka, topic } })
              }
            />
          </div>
          <InputField
            label="Partition (optional)"
            value={String(config.kafka?.partition ?? '')}
            placeholder="0"
            onChange={(partition) =>
              onChange({
                ...config,
                kafka: { ...config.kafka!, partition: partition ? Number(partition) : undefined },
              })
            }
          />
          <InputField
            label="Message Key (optional)"
            value={config.kafka?.key ?? ''}
            placeholder="e.g. account-id"
            onChange={(key) =>
              onChange({ ...config, kafka: { ...config.kafka!, key: key || undefined } })
            }
          />
        </div>
      )}

      {channel === 'mq' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <SelectField
              label="Queue"
              value={config.mq?.queue ?? MQ_QUEUES[0]}
              options={MQ_QUEUES.map((q) => ({ value: q, label: q }))}
              onChange={(queue) =>
                onChange({ ...config, mq: { ...config.mq, queue } })
              }
            />
          </div>
          <div className="col-span-2">
            <InputField
              label="Correlation ID (optional)"
              value={config.mq?.correlationId ?? ''}
              placeholder="e.g. corr-abc123"
              onChange={(correlationId) =>
                onChange({
                  ...config,
                  mq: { ...config.mq!, correlationId: correlationId || undefined },
                })
              }
            />
          </div>
        </div>
      )}

      {channel === 'webservice' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <SelectField
              label="Service"
              value={config.webservice?.service ?? WEB_SERVICES[0].id}
              options={WEB_SERVICES.map((s) => ({ value: s.id, label: s.label }))}
              onChange={(service) => {
                const svc = WEB_SERVICES.find((s) => s.id === service)
                onChange({
                  ...config,
                  webservice: {
                    service,
                    method: config.webservice?.method ?? 'POST',
                    endpoint: svc?.endpoint ?? config.webservice?.endpoint ?? '',
                  },
                })
              }}
            />
          </div>
          <SelectField
            label="HTTP Method"
            value={config.webservice?.method ?? 'POST'}
            options={['GET', 'POST', 'PUT', 'DELETE'].map((m) => ({ value: m, label: m }))}
            onChange={(method) =>
              onChange({
                ...config,
                webservice: { ...config.webservice!, method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' },
              })
            }
          />
          <InputField
            label="Endpoint"
            value={config.webservice?.endpoint ?? ''}
            placeholder="/api/v1/..."
            onChange={(endpoint) =>
              onChange({ ...config, webservice: { ...config.webservice!, endpoint } })
            }
          />
        </div>
      )}
    </div>
  )
}

export default ChannelConfigPanel
