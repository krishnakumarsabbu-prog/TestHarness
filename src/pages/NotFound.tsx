import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center" style={{ animation: 'slideUp 0.25s ease-out both' }}>
      <p className="text-8xl font-bold text-surface-300 mb-4 tracking-tight select-none" style={{ fontFamily: 'Georgia, serif' }}>404</p>
      <h2 className="text-xl font-semibold text-warm-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Page not found</h2>
      <p className="text-sm text-warm-400 mb-8 max-w-xs leading-relaxed">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
