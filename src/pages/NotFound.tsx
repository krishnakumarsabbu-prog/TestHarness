import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-8xl font-bold text-surface-200 mb-4 tracking-tight select-none">404</p>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Page not found</h2>
      <p className="text-sm text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
