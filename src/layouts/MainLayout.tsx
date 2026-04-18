import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-content mx-auto px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
