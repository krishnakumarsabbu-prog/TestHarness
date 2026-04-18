import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AlertsTemplate from './pages/AlertsTemplate'
import AlertsOnboarding from './pages/AlertsOnboarding'
import Transactions from './pages/Transactions'
import MessageSimulator from './pages/MessageSimulator'
import BatchProcessing from './pages/BatchProcessing'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/alerts-template" replace />} />
          <Route path="/alerts-template" element={<AlertsTemplate />} />
          <Route path="/alerts-onboarding" element={<AlertsOnboarding />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/message-simulator" element={<MessageSimulator />} />
          <Route path="/batch-processing" element={<BatchProcessing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
