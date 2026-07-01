import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Dashboard from '../pages/Dashboard'
import Tickets from '../pages/Tickets'
import Logs from '../pages/Logs'
import Statistiques from '../pages/Statistiques'
import Configuration from '../pages/Configuration'

function MainLayout({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="app-shell">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={onLogout}
      />
      <div className="app-main">
        <header className="mobile-header">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
          <span className="mobile-header-title">Ingetis Admin</span>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/statistiques" element={<Statistiques />} />
            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
