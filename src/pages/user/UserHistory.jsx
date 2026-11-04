import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'

export default function UserHistory() {
  const { currentUser } = useAuth()
  const { getUserAttempts } = useQuiz()

  const myAttempts = getUserAttempts(currentUser?.id)
  const sorted = [...myAttempts].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  const avgScore = myAttempts.length
    ? Math.round(myAttempts.reduce((s, a) => s + a.percentage, 0) / myAttempts.length)
    : 0
  const bestScore = myAttempts.length ? Math.max(...myAttempts.map(a => a.percentage)) : 0
  const passed = myAttempts.filter(a => a.percentage >= 60).length

  const formatDate = (d) => new Date(d).toLocaleString()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Quiz History 📜</h1>
          <p>Review all your past quiz attempts and scores.</p>
        </div>
        <Link to="/user" className="btn btn-outline">🏠 Dashboard</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '📝', label: 'Total Attempts', value: myAttempts.length, bg: '#e0e7ff', color: '#4f46e5' },
          { icon: '⭐', label: 'Average Score', value: `${avgScore}%`, bg: '#fef3c7', color: '#d97706' },
          { icon: '🏆', label: 'Best Score', value: `${bestScore}%`, bg: '#dcfce7', color: '#16a34a' },
          { icon: '✅', label: 'Passed (≥60%)', value: passed, bg: '#fee2e2', color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📜</div>
          <h3>No attempts yet</h3>
          <p>Start taking quizzes to see your history here.</p>
          <Link to="/user" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Quizzes</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Time Taken</th>
                <th>Status</th>
                <th>Completed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{a.quizTitle}</div>
                  </td>
                  <td>
                    <span className={`badge ${a.percentage >= 70 ? 'badge-success' : a.percentage >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                      {a.percentage}%
                    </span>
                  </td>
                  <td>{a.correct}/{a.total}</td>
                  <td>{a.timeTaken ? `${Math.floor(a.timeTaken/60)}m ${a.timeTaken%60}s` : '—'}</td>
                  <td>
                    <span className={`badge ${a.percentage >= 60 ? 'badge-success' : 'badge-danger'}`}>
                      {a.percentage >= 60 ? '✅ Pass' : '❌ Fail'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatDate(a.completedAt)}
                  </td>
                  <td>
                    <Link to={`/user/result/${a.id}`} className="btn btn-sm btn-outline">
                      📊 Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

