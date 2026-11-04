import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const { quizzes, attempts } = useQuiz()

  const totalParticipants = new Set(attempts.map(a => a.userId)).size
  const totalAttempts = attempts.length
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0

  const recentAttempts = [...attempts].sort((a, b) =>
    new Date(b.completedAt) - new Date(a.completedAt)
  ).slice(0, 5)

  const stats = [
    { icon: '📋', label: 'Total Quizzes', value: quizzes.length, bg: '#e0e7ff', color: '#4f46e5' },
    { icon: '👥', label: 'Participants', value: totalParticipants, bg: '#dcfce7', color: '#16a34a' },
    { icon: '📝', label: 'Total Attempts', value: totalAttempts, bg: '#fef3c7', color: '#d97706' },
    { icon: '⭐', label: 'Avg. Score', value: `${avgScore}%`, bg: '#fee2e2', color: '#dc2626' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard 👑</h1>
          <p>Welcome back, {currentUser?.name}! Manage your quizzes and monitor performance.</p>
        </div>
        <Link to="/admin/create-quiz" className="btn btn-primary">➕ Create New Quiz</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/create-quiz" className="btn btn-primary">📝 Create Quiz</Link>
          <Link to="/admin/manage-quizzes" className="btn btn-secondary">📋 Manage Quizzes</Link>
          <Link to="/admin/reports" className="btn btn-outline">📊 View Reports</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Quizzes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Quizzes</h2>
            <Link to="/admin/manage-quizzes" className="btn btn-sm btn-outline">View All</Link>
          </div>
          {quizzes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No quizzes yet</h3>
              <p>Create your first quiz to get started.</p>
            </div>
          ) : (
            <div>
              {quizzes.slice(-5).reverse().map(q => (
                <div key={q.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.75rem 0', borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {q.questions?.length || 0} questions • {q.category}
                    </div>
                  </div>
                  <Link to={`/admin/edit-quiz/${q.id}`} className="btn btn-sm btn-outline">Edit</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Attempts</h2>
            <Link to="/admin/reports" className="btn btn-sm btn-outline">Reports</Link>
          </div>
          {recentAttempts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No attempts yet</h3>
              <p>Users haven't taken any quizzes yet.</p>
            </div>
          ) : (
            <div>
              {recentAttempts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 0', borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.quizTitle}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      by {a.userName}
                    </div>
                  </div>
                  <span className={`badge ${a.percentage >= 70 ? 'badge-success' : a.percentage >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                    {a.percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

