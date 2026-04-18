import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-6xl font-semibold text-gray-300 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found.</p>
      <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
