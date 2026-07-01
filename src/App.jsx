import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import Logs from './pages/Logs'
import Statistiques from './pages/Statistiques'
import Configuration from './pages/Configuration'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

function MainLayout({ onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={onLogout} />
      <div style={{ flex: 1, padding: '24px', backgroundColor: '#f8f9fa' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/configuration" element={<Configuration />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  const [connecte, setConnecte] = useState(!!localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setConnecte(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/callback"
          element={<AuthCallback onLogin={() => setConnecte(true)} />}
        />
        <Route
          path="*"
          element={
            connecte ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
