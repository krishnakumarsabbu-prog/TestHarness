import { useState } from 'react'
import PageContainer from '../components/ui/PageContainer'
import SectionCard from '../components/ui/SectionCard'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import Tabs from '../components/ui/Tabs'
import Modal from '../components/ui/Modal'
import Table, { type Column } from '../components/ui/Table'
import JSONEditor from '../components/ui/JSONEditor'
import { useToast } from '../components/ui/Toast'

interface Transaction {
  id: string
  merchant: string
  amount: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  [key: string]: unknown
}

const mockData: Transaction[] = Array.from({ length: 22 }, (_, i) => ({
  id: `TXN-${1000 + i}`,
  merchant: ['Stripe Inc.', 'Shopify', 'PayPal', 'Square', 'Braintree'][i % 5],
  amount: `$${(Math.random() * 500 + 10).toFixed(2)}`,
  status: (['completed', 'pending', 'failed'] as const)[i % 3],
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
}))

const columns: Column<Transaction>[] = [
  { key: 'id', header: 'Transaction ID', width: '140px' },
  { key: 'merchant', header: 'Merchant' },
  { key: 'amount', header: 'Amount', align: 'right', width: '120px' },
  {
    key: 'status',
    header: 'Status',
    width: '120px',
    render: (row) => {
      const styles = {
        completed: 'bg-success-100 text-success-600',
        pending: 'bg-warning-100 text-warning-600',
        failed: 'bg-danger-100 text-danger-600',
      }
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[row.status]}`}>
          {row.status}
        </span>
      )
    },
  },
  { key: 'date', header: 'Date', width: '120px' },
]

const INITIAL_JSON = `{
  "alertType": "TRANSACTION",
  "channel": "SMS",
  "template": "Your transaction of {{amount}} was {{status}}.",
  "enabled": true
}`

function ComponentDemo() {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [json, setJson] = useState(INITIAL_JSON)
  const [formValues, setFormValues] = useState({ name: '', channel: '', message: '' })
  const [loading, setLoading] = useState(false)

  const pageSize = 5
  const paged = mockData.slice((page - 1) * pageSize, page * pageSize)

  function handleSubmit() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ type: 'success', title: 'Saved successfully', message: 'Your changes have been applied.' })
    }, 1200)
  }

  const tabs = [
    {
      id: 'form',
      label: 'Form Fields',
      badge: 3,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Alert Name"
            placeholder="e.g. Low Balance Alert"
            required
            value={formValues.name}
            onChange={(e) => setFormValues((v) => ({ ...v, name: (e.target as HTMLInputElement).value }))}
          />
          <FormField
            as="select"
            label="Channel"
            value={formValues.channel}
            onChange={(e) => setFormValues((v) => ({ ...v, channel: (e.target as HTMLSelectElement).value }))}
          >
            <option value="">Select channel…</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="push">Push</option>
          </FormField>
          <FormField
            as="textarea"
            label="Message Template"
            placeholder="Enter message template…"
            hint="Use {{variable}} for dynamic values."
            rows={3}
            className="sm:col-span-2"
            value={formValues.message}
            onChange={(e) => setFormValues((v) => ({ ...v, message: (e.target as HTMLTextAreaElement).value }))}
          />
          <FormField
            label="Validation Example"
            placeholder="Must be at least 4 characters"
            error="This field is required."
          />
        </div>
      ),
    },
    {
      id: 'buttons',
      label: 'Buttons',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sizes</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">States</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
              >
                With Icon
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'json',
      label: 'JSON Editor',
      content: (
        <JSONEditor
          label="Alert Configuration"
          value={json}
          onChange={(v) => setJson(v)}
          rows={12}
        />
      ),
    },
  ]

  return (
    <PageContainer
      title="Component Library"
      subtitle="A showcase of all reusable UI components in the design system."
      actions={
        <>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button onClick={handleSubmit} loading={loading}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-6">

        <SectionCard title="Toast Notifications" description="Trigger different notification types.">
          <div className="flex flex-wrap gap-2">
            {(['success', 'error', 'warning', 'info'] as const).map((type) => (
              <Button
                key={type}
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast({
                    type,
                    title: `${type.charAt(0).toUpperCase() + type.slice(1)} notification`,
                    message: `This is a sample ${type} message.`,
                  })
                }
              >
                {type}
              </Button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Tabs" description="Underline and pill variants.">
          <div className="space-y-6">
            <Tabs tabs={tabs} variant="underline" />
          </div>
        </SectionCard>

        <SectionCard>
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pill Tabs</p>
          </div>
          <Tabs
            variant="pill"
            tabs={[
              { id: 'all', label: 'All', badge: 22, content: <span /> },
              { id: 'completed', label: 'Completed', badge: 8, content: <span /> },
              { id: 'pending', label: 'Pending', badge: 7, content: <span /> },
              { id: 'failed', label: 'Failed', badge: 7, content: <span /> },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Transactions"
          description="Basic table with pagination."
          actions={<Button size="sm" variant="secondary">Export</Button>}
          noPadding
        >
          <div className="p-6">
            <Table
              columns={columns}
              data={paged}
              keyField="id"
              page={page}
              pageSize={pageSize}
              totalCount={mockData.length}
              onPageChange={setPage}
            />
          </div>
        </SectionCard>

      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Alert Template"
        description="Fill in the details below to create a new alert template."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => { setModalOpen(false); toast({ type: 'success', title: 'Template created' }) }}>
              Create Template
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Template Name" placeholder="e.g. Low Balance" required />
          <FormField
            as="select"
            label="Channel"
          >
            <option value="">Select…</option>
            <option>SMS</option>
            <option>Email</option>
          </FormField>
          <FormField
            as="textarea"
            label="Message"
            placeholder="Your balance is {{balance}}."
            hint="Use {{variable}} syntax for dynamic content."
            rows={3}
          />
        </div>
      </Modal>
    </PageContainer>
  )
}

export default ComponentDemo
