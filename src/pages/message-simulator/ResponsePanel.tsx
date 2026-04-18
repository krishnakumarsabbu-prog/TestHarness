import type { SimulationResponse, LogEntry } from './types'

const LOG_LEVEL_STYLES: Record<LogEntry['level'], string> = {
  info: 'text-blue-400',
  warn: 'text-amber-400',
  error: 'text-red-400',
  debug: 'text-slate-400',
}

const LOG_LEVEL_BADGE: Record<LogEntry['level'], string> = {
  info: 'text-blue-300',
  warn: 'text-amber-300',
  error: 'text-red-300',
  debug: 'text-slate-500',
}

interface ResponsePanelProps {
  response: SimulationResponse
}

function ResponsePanel({ response }: ResponsePanelProps) {
  const { status, httpStatus, responseTime, message, logs, timestamp } = response

  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-400">Send a message to see the response</p>
      </div>
    )
  }

  if (status === 'sending') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-500">Sending message...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
              status === 'success'
                ? 'bg-success-50 text-success-700 border-success-200'
                : 'bg-danger-50 text-danger-700 border-danger-200'
            }`}
          >
            {status === 'success' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
            {status === 'success' ? 'Success' : 'Failed'}
          </div>
          {httpStatus && (
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                httpStatus < 300
                  ? 'bg-success-50 text-success-700 border-success-200'
                  : 'bg-danger-50 text-danger-700 border-danger-200'
              }`}
            >
              HTTP {httpStatus}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {responseTime !== undefined && (
            <span className="text-xs text-slate-500">
              <span className="font-mono font-medium text-slate-700">{responseTime}ms</span> response time
            </span>
          )}
          {timestamp && (
            <span className="text-xs text-slate-400 font-mono">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm border ${
            status === 'success'
              ? 'bg-success-50 text-success-700 border-success-100'
              : 'bg-danger-50 text-danger-700 border-danger-100'
          }`}
        >
          {message}
        </div>
      )}

      {logs.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-600">Logs</span>
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-slate-600 shrink-0 select-none">
                    {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={`uppercase font-bold shrink-0 w-10 ${LOG_LEVEL_BADGE[log.level]}`}>
                    {log.level}
                  </span>
                  <span className={LOG_LEVEL_STYLES[log.level]}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponsePanel
