import { useMemo, useState } from 'react'
import { SectionCard, Button } from '../ui'
import type { AlertConfig, AlertField } from './types'

interface Props {
  config: AlertConfig
}

function buildJson(config: AlertConfig) {
  const { metadata, fields } = config

  return {
    alertName: metadata.alertName || undefined,
    alertType: metadata.alertType || undefined,
    sourceType: metadata.sourceType || undefined,
    version: metadata.version || undefined,
    description: metadata.description || undefined,
    fields: fields.map((f: AlertField) => {
      const obj: Record<string, unknown> = {
        fieldName: f.fieldName || '(unnamed)',
        fieldType: f.fieldType,
        required: f.required,
      }
      if (f.defaultValue) obj.defaultValue = f.defaultValue
      if (f.fieldType === 'Dropdown' && f.dropdownValues) {
        obj.dropdownValues = f.dropdownValues.split(',').map(v => v.trim()).filter(Boolean)
      }
      return obj
    }),
  }
}

function ColorizedJson({ value }: { value: unknown }) {
  const lines = JSON.stringify(value, null, 2).split('\n')

  return (
    <div className="font-mono text-xs leading-relaxed">
      {lines.map((line, i) => {
        const colored = line
          .replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            match => {
              if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  return `<span class="text-slate-700 font-semibold">${match}</span>`
                }
                return `<span class="text-emerald-700">${match}</span>`
              }
              if (/true|false/.test(match)) {
                return `<span class="text-blue-600">${match}</span>`
              }
              if (/null/.test(match)) {
                return `<span class="text-slate-400">${match}</span>`
              }
              return `<span class="text-amber-700">${match}</span>`
            }
          )
        return (
          <div
            key={i}
            dangerouslySetInnerHTML={{ __html: colored }}
            className="whitespace-pre"
          />
        )
      })}
    </div>
  )
}

function ConfigurationPreview({ config }: Props) {
  const [copied, setCopied] = useState(false)

  const json = useMemo(() => buildJson(config), [config])
  const jsonString = JSON.stringify(json, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <SectionCard
      title="Configuration Preview"
      description="Live JSON representation of your alert configuration. Updates as you type."
      actions={
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          icon={
            copied ? (
              <svg className="w-3.5 h-3.5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )
          }
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      }
    >
      <div className="relative bg-slate-900 rounded-xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-700/60">
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <span className="ml-2 text-xs text-slate-500 font-mono">alert-config.json</span>
        </div>
        <div className="p-5 overflow-x-auto max-h-96 overflow-y-auto">
          <ColorizedJson value={json} />
        </div>
      </div>
    </SectionCard>
  )
}

export default ConfigurationPreview
