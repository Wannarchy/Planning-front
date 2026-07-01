import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

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
