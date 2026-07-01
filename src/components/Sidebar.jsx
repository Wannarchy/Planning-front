import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { path: '/', label: '📊 Tableau de bord' },
  { path: '/tickets', label: '🎫 Tickets' },
  { path: '/logs', label: '📋 Logs' },
  { path: '/statistiques', label: '📈 Statistiques' },
  { path: '/configuration', label: '⚙️ Configuration' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#212529',
      padding: '24px 0',
    }}>
      <div style={{ color: 'white', textAlign: 'center', marginBottom: '32px' }}>
        <h5>🎓 Ingetis Admin</h5>
      </div>
      <Nav className="flex-column">
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
    </div>
  )
}

export default Sidebar