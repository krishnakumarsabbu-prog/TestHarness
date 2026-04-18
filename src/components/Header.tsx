import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900 no-underline hover:text-gray-700">
          Project
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 no-underline transition-colors">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
