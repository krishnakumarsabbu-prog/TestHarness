import { useState, useCallback } from 'react'
import type { Scenario, ChannelType } from './types'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const CHANNEL_LABELS: Record<ChannelType, string> = {
  kafka: 'Kafka',
  mq: 'MQ',
  webservice: 'Web Service',
}

const CHANNEL_COLORS: Record<ChannelType, string> = {
  kafka: 'bg-blue-50 text-blue-700 border-blue-200',
  mq: 'bg-amber-50 text-amber-700 border-amber-200',
  webservice: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

interface ScenarioPanelProps {
  scenarios: Scenario[]
  onLoad: (scenario: Scenario) => void
  onDelete: (id: string) => void
  currentChannel: ChannelType
  onSave: (name: string, description: string) => void
}

function ScenarioPanel({ scenarios, onLoad, onDelete, currentChannel, onSave }: ScenarioPanelProps) {
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [filterChannel, setFilterChannel] = useState<ChannelType | 'all'>('all')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleSave = useCallback(() => {
    if (!name.trim()) return
    onSave(name.trim(), description.trim())
    setName('')
    setDescription('')
    setSaveModalOpen(false)
  }, [name, description, onSave])

  const filtered = filterChannel === 'all'
    ? scenarios
    : scenarios.filter((s) => s.channel === filterChannel)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">Saved Scenarios</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-slate-500 font-medium border border-surface-200">
            {scenarios.length}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSaveModalOpen(true)}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
        >
          Save Current
        </Button>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-surface-100 rounded-xl w-fit border border-surface-200">
        {(['all', 'kafka', 'mq', 'webservice'] as const).map((ch) => (
          <button
            key={ch}
            onClick={() => setFilterChannel(ch)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
              filterChannel === ch
                ? 'bg-white text-slate-800 shadow-soft-sm border border-surface-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {ch === 'all' ? 'All' : CHANNEL_LABELS[ch]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <div className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center border border-surface-200">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-400">No scenarios saved</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((scenario) => (
            <div
              key={scenario.id}
              className="group flex items-start gap-3 p-3.5 rounded-xl border border-surface-200 bg-white hover:border-surface-300 hover:shadow-soft-sm transition-all duration-150"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-800 truncate">{scenario.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium border shrink-0 ${CHANNEL_COLORS[scenario.channel]}`}
                  >
                    {CHANNEL_LABELS[scenario.channel]}
                  </span>
                </div>
                {scenario.description && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{scenario.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {new Date(scenario.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => onLoad(scenario)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
                  title="Load scenario"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
                <button
                  onClick={() => setConfirmDeleteId(scenario.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-all duration-150"
                  title="Delete scenario"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Scenario"
        description={`Save current ${CHANNEL_LABELS[currentChannel]} configuration as a reusable scenario`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Scenario Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Payment Created - Happy Path"
              className="w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this scenario"
              className="w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Scenario"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirmDeleteId) onDelete(confirmDeleteId)
                setConfirmDeleteId(null)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this scenario?
        </p>
      </Modal>
    </div>
  )
}

export default ScenarioPanel
