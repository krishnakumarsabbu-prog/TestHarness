function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 max-w-6xl text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Project. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
