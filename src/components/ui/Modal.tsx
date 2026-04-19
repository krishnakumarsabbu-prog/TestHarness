import { useEffect, type ReactNode } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: ModalSize
  children: ReactNode
  footer?: ReactNode
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

function Modal({ open, onClose, title, description, size = 'md', children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.15s ease-out both' }}
        onClick={onClose}
      />

      <div
        className={`relative w-full ${sizeClasses[size]} bg-ivory rounded-xl shadow-soft-lg border border-surface-200 flex flex-col max-h-[90vh]`}
        style={{ animation: 'slideUp 0.2s cubic-bezier(0.34,1.2,0.64,1) both' }}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-surface-100 shrink-0">
            <div>
              {title && <h2 className="section-title">{title}</h2>}
              {description && <p className="mt-1 text-xs text-warm-500">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-surface-100 transition-all duration-150 active:scale-90 shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-surface-100 shrink-0 bg-surface-50/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
