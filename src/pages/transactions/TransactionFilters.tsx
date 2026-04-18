import { useState } from 'react'
import { Button } from '../../components/ui'
import MultiSelect from '../../components/ui/MultiSelect'
import { INBOUND_SOURCES, MESSAGE_KEY_TYPES, CHANNELS, type InboundSource, type MessageKeyType, type Channel } from './mockData'

export interface FilterState {
  inboundSource: InboundSource | ''
  messageKeyType: MessageKeyType | ''
  messageValue: string
  dateFrom: string
  dateTo: string
  channels: Channel[]
}

interface TransactionFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onSearch: () => void
  onReset: () => void
}

export const DEFAULT_FILTERS: FilterState = {
  inboundSource: '',
  messageKeyType: '',
  messageValue: '',
  dateFrom: '',
  dateTo: '',
  channels: [],
}

function TransactionFilters({ filters, onChange, onSearch, onReset }: TransactionFiltersProps) {
  const [expanded, setExpanded] = useState(true)

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-soft overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-50/60 transition-colors duration-150"
      >
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
          <span className="text-sm font-semibold text-slate-800">Filters</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-surface-100" style={{ animation: 'slideUp 0.15s ease-out both' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Inbound Source</label>
              <select
                value={filters.inboundSource}
                onChange={(e) => set('inboundSource', e.target.value as InboundSource | '')}
                className="input"
              >
                <option value="">All sources</option>
                {INBOUND_SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Message Key Type</label>
              <select
                value={filters.messageKeyType}
                onChange={(e) => set('messageKeyType', e.target.value as MessageKeyType | '')}
                className="input"
              >
                <option value="">All types</option>
                {MESSAGE_KEY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Message Value</label>
              <input
                type="text"
                value={filters.messageValue}
                onChange={(e) => set('messageValue', e.target.value)}
                placeholder="Search by message value..."
                className="input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => set('dateFrom', e.target.value)}
                className="input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => set('dateTo', e.target.value)}
                className="input"
              />
            </div>

            <MultiSelect
              label="Channel"
              options={CHANNELS}
              selected={filters.channels}
              onChange={(v) => set('channels', v as Channel[])}
              placeholder="All channels"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-surface-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={onReset}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              }
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSearch}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              }
            >
              Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionFilters
