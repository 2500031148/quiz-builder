import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'
import { showToast } from '../../components/Toast'

export default function UserProfile() {
  const { currentUser, logout } = useAuth()
  const { getUserAttempts } = useQuiz()
  const navigate = useNavigate()

  const myAttempts = getUserAttempts(currentUser?.id)
  const avgScore = myAttempts.length
    ? Math.round(myAttempts.reduce((s, a) => s + a.percentage, 0) / myAttempts.length)
    : 0
  const bestScore = myAttempts.length ? Math.max(...myAttempts.map(a => a.percentage)) : 0
  const passed = myAttempts.filter(a => a.percentage >= 60).length
  const totalTime = myAttempts.reduce((s, a) => s + (a.timeTaken || 0), 0)

  // Category breakdown
  const catMap = {}
  myAttempts.forEach(a => {
    const cat = a.quizTitle || 'Unknown'
    if (!catMap[cat]) catMap[cat] = { attempts: 0, totalPct: 0 }
    catMap[cat].attempts++
    catMap[cat].totalPct += a.percentage
  })

  const handleLogout = () => {
    showToast('Logged out successfully.', 'info')
    setTimeout(() => { logout(); navigate('/login') }, 500)
  }

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  const avatarColors = ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
  const avatarColor = avatarColors[(currentUser?.name?.charCodeAt(0) || 0) % avatarColors.length]

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <div>
          <h1>My Profile 👤</h1>
          <p>Your account information and quiz statistics.</p>
        </div>
        <Link to="/user" className="btn btn-outline">🏠 Dashboard</Link>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', margin: '0 auto 1rem',
          background: avatarColor, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', fontWeight: 900,
          boxShadow: `0 0 0 4px ${avatarColor}33`,
        }}>
          {currentUser?.name?.[0]?.toUpperCase()}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {currentUser?.name}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{currentUser?.email}</p>
        <span className={`badge ${currentUser?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}
          style={{ fontSize: '0.85rem', padding: '0.3rem 0.9rem' }}>
          {currentUser?.role === 'admin' ? '👑 Admin' : '👤 Student'}
        </span>

        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: '📝', label: 'Total Attempts', value: myAttempts.length, bg: '#e0e7ff', color: '#4f46e5' },
          { icon: '⭐', label: 'Avg Score', value: `${avgScore}%`, bg: '#fef3c7', color: '#d97706' },
          { icon: '🏆', label: 'Best Score', value: `${bestScore}%`, bg: '#dcfce7', color: '#16a34a' },
          { icon: '✅', label: 'Passed', value: passed, bg: '#fee2e2', color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Additional stats */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">Activity Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            ['⏱️', 'Total Quiz Time', totalTime > 0 ? formatTime(totalTime) : '—'],
            ['📊', 'Pass Rate', myAttempts.length > 0 ? `${Math.round((passed / myAttempts.length) * 100)}%` : '—'],
            ['🔥', 'Quizzes Attempted', myAttempts.length],
            ['📅', 'Member Since', currentUser?.id ? new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'],
          ].map(([icon, label, val]) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)'
            }}>
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontWeight: 800 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score progress bar */}
      {myAttempts.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Overall Performance</h2>
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Average Score</span>
            <span style={{ fontWeight: 700, color: avgScore >= 70 ? 'var(--success)' : avgScore >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
              {avgScore}%
            </span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 999, height: 12, overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{
              height: '100%', width: `${avgScore}%`,
              background: avgScore >= 70 ? 'var(--success)' : avgScore >= 40 ? 'var(--warning)' : 'var(--danger)',
              borderRadius: 999, transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to="/user/leaderboard" className="btn btn-outline btn-sm">🏆 View Leaderboard</Link>
            <Link to="/user/history" className="btn btn-outline btn-sm">📜 Full History</Link>
          </div>
        </div>
      )}

      {/* Recent attempts */}
      {myAttempts.length > 0 && (
        <div className="card">
          <h2 className="section-title">Recent Attempts</h2>
          {[...myAttempts].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5).map(a => (
            <div key={a.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem 0', borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.quizTitle}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {new Date(a.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${a.percentage >= 70 ? 'badge-success' : a.percentage >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                  {a.percentage}%
                </span>
                <Link to={`/user/result/${a.id}`} className="btn btn-sm btn-outline">Review</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {myAttempts.length === 0 && (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No quiz attempts yet</h3>
          <p>Take your first quiz to start building your profile.</p>
          <Link to="/user" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Quizzes</Link>
        </div>
      )}
    </div>
  )
}
