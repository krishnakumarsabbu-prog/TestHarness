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
          <div className="px-6 py-6 xl:px-10 2xl:px-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
