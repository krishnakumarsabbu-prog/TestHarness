import { useState } from 'react'
import { PageContainer, SectionCard, FormField, Button } from '../components/ui'
import MultiSelect from '../components/ui/MultiSelect'

const CHANNEL_OPTIONS = ['Email', 'SMS', 'Push', 'Inbox']
const LANGUAGE_OPTIONS = ['English', 'Spanish']
const VERSION_OPTIONS = ['2022', '2023']

const MOCK_RESPONSE = {
  rawTemplate: `{
  "templateId": "alert_payment_failed_v2",
  "name": "Payment Failed Alert",
  "channel": ["Email", "SMS"],
  "language": "English",
  "version": "2023",
  "subject": "Action Required: Payment Failed for {{account_name}}",
  "body": "Dear {{first_name}},\\n\\nWe were unable to process your payment of {{amount}} on {{date}}.\\n\\nPlease update your payment method at: {{payment_url}}\\n\\nIf you have questions, contact us at support@example.com.\\n\\nRegards,\\nThe Alerts Team",
  "variables": ["first_name", "account_name", "amount", "date", "payment_url"],
  "metadata": {
    "created": "2023-04-01T00:00:00Z",
    "lastModified": "2023-11-15T12:34:00Z",
    "status": "active"
  }
}`,
  htmlTemplate: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Payment Failed Alert</title>
  <style>
    body { font-family: Inter, sans-serif; background: #f8fafc; margin: 0; padding: 32px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #1e40af; padding: 28px 32px; }
    .header h1 { color: white; margin: 0; font-size: 18px; font-weight: 600; }
    .body { padding: 32px; color: #334155; font-size: 14px; line-height: 1.7; }
    .body p { margin: 0 0 16px; }
    .cta { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 8px 0 16px; }
    .footer { padding: 20px 32px; background: #f1f5f9; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Action Required: Payment Failed</h1>
    </div>
    <div class="body">
      <p>Dear <strong>{{first_name}}</strong>,</p>
      <p>We were unable to process your payment of <strong>{{amount}}</strong> on <strong>{{date}}</strong> for account <strong>{{account_name}}</strong>.</p>
      <p>Please update your payment method to avoid service interruption:</p>
      <a href="{{payment_url}}" class="cta">Update Payment Method</a>
      <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
      <p>Regards,<br /><strong>The Alerts Team</strong></p>
    </div>
    <div class="footer">
      You received this email because you have an active account. &copy; 2023 Example Corp.
    </div>
  </div>
</body>
</html>`,
}

interface TemplateResult {
  rawTemplate: string
  htmlTemplate: string
}

function AlertsTemplate() {
  const [templateName, setTemplateName] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [version, setVersion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TemplateResult | null>(null)
  const [fetched, setFetched] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    setResult(null)
    await new Promise((r) => setTimeout(r, 1200))
    setResult(MOCK_RESPONSE)
    setFetched(true)
    setLoading(false)
  }

  const handleDownload = (type: 'raw' | 'html') => {
    if (!result) return
    const content = type === 'raw' ? result.rawTemplate : result.htmlTemplate
    const mimeType = type === 'raw' ? 'application/json' : 'text/html'
    const ext = type === 'raw' ? 'json' : 'html'
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `template.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer
      title="Alerts Template"
      subtitle="Fetch and preview alert templates by channel, language, and version."
    >
      <div className="space-y-6">
        <SectionCard
          title="Template Parameters"
          description="Configure the template you want to retrieve"
          actions={
            <Button onClick={handleFetch} loading={loading} disabled={loading} size="md">
              {loading ? 'Fetching…' : 'Fetch Templates'}
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Template Name"
              placeholder="e.g. payment_failed_alert"
              value={templateName}
              onChange={(e) => setTemplateName((e.target as HTMLInputElement).value)}
            />

            <FormField
              as="select"
              label="Version"
              value={version}
              onChange={(e) => setVersion((e.target as HTMLSelectElement).value)}
            >
              <option value="">Select version…</option>
              {VERSION_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </FormField>

            <MultiSelect
              label="Channel"
              options={CHANNEL_OPTIONS}
              selected={selectedChannels}
              onChange={setSelectedChannels}
              placeholder="Select channels…"
            />

            <MultiSelect
              label="Language"
              options={LANGUAGE_OPTIONS}
              selected={selectedLanguages}
              onChange={setSelectedLanguages}
              placeholder="Select languages…"
            />
          </div>
        </SectionCard>

        {loading && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-soft border border-surface-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                  <div className="space-y-1.5">
                    <div className="skeleton-shimmer h-3.5 w-32 rounded-lg" />
                    <div className="skeleton-shimmer h-3 w-44 rounded-lg" />
                  </div>
                  <div className="skeleton-shimmer h-8 w-24 rounded-xl" />
                </div>
                <div className="p-5 space-y-2.5">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <div key={j} className="skeleton-shimmer h-3.5 rounded-lg" style={{ width: `${45 + (j * 11) % 50}%`, opacity: 1 - j * 0.07 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !fetched && (
          <div className="bg-white rounded-2xl shadow-soft border border-surface-200 flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-700">No template loaded</p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Configure the parameters above and click Fetch Templates to preview your alert template.</p>
            </div>
          </div>
        )}

        {!loading && result && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" style={{ animation: 'slideUp 0.2s ease-out both' }}>
            <SectionCard
              title="Raw Template"
              description="JSON source of the template"
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<DownloadIcon />}
                  onClick={() => handleDownload('raw')}
                >
                  Download
                </Button>
              }
              noPadding
            >
              <pre className="overflow-auto text-xs leading-relaxed font-mono whitespace-pre-wrap break-words text-emerald-300 bg-slate-950 rounded-b-2xl p-5 max-h-[480px]">
                {result.rawTemplate}
              </pre>
            </SectionCard>

            <SectionCard
              title="HTML Template"
              description="Rendered preview of the template layout"
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<DownloadIcon />}
                  onClick={() => handleDownload('html')}
                >
                  Download
                </Button>
              }
              noPadding
            >
              <div className="rounded-b-2xl overflow-hidden bg-slate-50">
                <iframe
                  srcDoc={result.htmlTemplate}
                  className="w-full border-0"
                  style={{ height: '480px' }}
                  title="HTML Template Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}

export default AlertsTemplate
