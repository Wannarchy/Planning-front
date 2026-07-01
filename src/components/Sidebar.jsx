import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const links = [
  { path: '/', label: 'Tableau de bord', icon: '📊' },
  { path: '/tickets', label: 'Tickets', icon: '🎫' },
  { path: '/logs', label: 'Logs', icon: '📋' },
  { path: '/statistiques', label: 'Statistiques', icon: '📈' },
  { path: '/configuration', label: 'Configuration', icon: '⚙️' },
]

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

function avatarUrl(user) {
  if (!user?.discord_id || !user?.avatar) return null
  return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png?size=64`
}

function initiales(user) {
  const name = user?.global_name || user?.username || '?'
  return name.charAt(0).toUpperCase()
}

function Sidebar({ open, onClose, onLogout }) {
  const location = useLocation()
  const user = getUser()
  const avatar = user ? avatarUrl(user) : null

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">🎓</div>
            <div>
              <div className="sidebar-brand-text">Ingetis</div>
              <div className="sidebar-brand-sub">Administration</div>
            </div>
          </div>

          {user && (
            <div className="sidebar-user">
              {avatar ? (
                <img src={avatar} alt="" className="sidebar-avatar" />
              ) : (
                <div className="sidebar-avatar-fallback">{initiales(user)}</div>
              )}
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.global_name || user.username}</div>
                <div className="sidebar-user-handle">@{user.username}</div>
              </div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`sidebar-link ${isActive(link.path) ? 'sidebar-link-active' : ''}`}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-logout" onClick={onLogout}>
            <span>⏻</span>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
