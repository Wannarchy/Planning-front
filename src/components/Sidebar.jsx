import { Nav, Button, Badge } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { path: '/', label: '📊 Tableau de bord' },
  { path: '/tickets', label: '🎫 Tickets' },
  { path: '/logs', label: '📋 Logs' },
  { path: '/statistiques', label: '📈 Statistiques' },
  { path: '/configuration', label: '⚙️ Configuration' },
]

function Sidebar({ onLogout }) {
  const location = useLocation()
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })()

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#212529',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ color: 'white', textAlign: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <h5 className="mb-1">🎓 Ingetis Admin</h5>
        {user && (
          <div style={{ fontSize: '0.8rem', color: '#adb5bd', marginTop: '8px' }}>
            <div className="fw-semibold" style={{ color: '#dee2e6' }}>
              {user.global_name || user.username}
            </div>
            <Badge bg="secondary" style={{ fontSize: '0.65rem', marginTop: '4px' }}>
              {user.username}
            </Badge>
          </div>
        )}
      </div>

      <Nav className="flex-column flex-grow-1">
        {links.map(link => (
          <Nav.Link
            key={link.path}
            as={Link}
            to={link.path}
            style={{
              color: location.pathname === link.path ? '#0d6efd' : '#adb5bd',
              backgroundColor: location.pathname === link.path ? '#2c3034' : 'transparent',
              padding: '12px 24px',
              fontWeight: location.pathname === link.path ? '600' : '400',
            }}
          >
            {link.label}
          </Nav.Link>
        ))}
      </Nav>

      <div style={{ padding: '16px 24px 0', borderTop: '1px solid #343a40' }}>
        <Button
          variant="outline-light"
          size="sm"
          className="w-100"
          onClick={onLogout}
        >
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
