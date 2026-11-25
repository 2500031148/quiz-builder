import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { showToast } from './Toast'
import './Navbar.css'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    showToast('Logged out successfully!', 'info')
    logout()
    navigate('/login')
  }

  const isAdmin = currentUser?.role === 'admin'
  const basePath = isAdmin ? '/admin' : '/user'

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: '🏠 Dashboard' },
        { to: '/admin/create-quiz', label: '➕ Create Quiz' },
        { to: '/admin/manage-quizzes', label: '📋 Manage Quizzes' },
        { to: '/admin/reports', label: '📊 Reports' },
      ]
    : [
        { to: '/user', label: '🏠 Dashboard' },
        { to: '/user/leaderboard', label: '🏆 Leaderboard' },
        { to: '/user/history', label: '📜 My History' },
        { to: '/user/profile', label: '👤 Profile' },
      ]

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-brand">
          <Link to={basePath}>
            <span className="brand-icon">📝</span>
            <span className="brand-name">Quiz<span>Builder</span></span>
          </Link>
        </div>

        <nav className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-user">
          <button
            type="button"
            className="btn btn-sm"
            onClick={toggleTheme}
            aria-label={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ fontSize: '1.1rem', padding: '0.35rem 0.65rem', marginRight: '0.5rem', background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <div className="user-info">
            <div className="user-avatar">{currentUser?.name?.[0]?.toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{currentUser?.name}</span>
              <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>
                {isAdmin ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>
          <button className="btn btn-sm logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

