import { useQuiz } from '../../context/QuizContext'

export default function AdminReports() {
  const { quizzes, attempts } = useQuiz()

  const totalParticipants = new Set(attempts.map(a => a.userId)).size
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
    : 0

  const quizStats = quizzes.map(q => {
    const qAttempts = attempts.filter(a => a.quizId === q.id)
    const avg = qAttempts.length
      ? Math.round(qAttempts.reduce((s, a) => s + a.percentage, 0) / qAttempts.length)
      : null
    const passed = qAttempts.filter(a => a.percentage >= 60).length
    return { ...q, attempts: qAttempts, avg, passed }
  })

  const sortedAttempts = [...attempts].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  const formatDate = (d) => new Date(d).toLocaleString()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics 📊</h1>
          <p>Overview of quiz performance and participant activity.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        {[
          { icon: '📋', label: 'Total Quizzes', value: quizzes.length, bg: '#e0e7ff', color: '#4f46e5' },
          { icon: '👥', label: 'Unique Participants', value: totalParticipants, bg: '#dcfce7', color: '#16a34a' },
          { icon: '📝', label: 'Total Attempts', value: attempts.length, bg: '#fef3c7', color: '#d97706' },
          { icon: '⭐', label: 'Overall Avg Score', value: `${avgScore}%`, bg: '#fee2e2', color: '#dc2626' },
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

      {/* Per-Quiz Stats */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Quiz Performance</h2>
        {quizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No quizzes yet</h3>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Category</th>
                <th>Attempts</th>
                <th>Avg Score</th>
                <th>Passed (≥60%)</th>
                <th>Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {quizStats.map(q => (
                <tr key={q.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{q.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{q.questions?.length || 0} questions</div>
                  </td>
                  <td><span className="badge badge-primary">{q.category}</span></td>
                  <td>{q.attempts.length}</td>
                  <td>
                    {q.avg !== null ? (
                      <span className={`badge ${q.avg >= 70 ? 'badge-success' : q.avg >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                        {q.avg}%
                      </span>
                    ) : '—'}
                  </td>
                  <td>{q.passed}</td>
                  <td>
                    {q.attempts.length > 0 ? (
                      <div>
                        <div className="progress-bar-container" style={{ width: 100, display: 'inline-block', marginRight: 8 }}>
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.round((q.passed / q.attempts.length) * 100)}%` }}
                          />
                        </div>
                        {Math.round((q.passed / q.attempts.length) * 100)}%
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Attempts */}
      <div className="card">
        <h2 className="section-title">All Attempts</h2>
        {attempts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No attempts recorded yet</h3>
            <p>Share your quizzes with users to start seeing results.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Time Taken</th>
                <th>Completed At</th>
              </tr>
            </thead>
            <tbody>
              {sortedAttempts.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{a.userName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.userEmail}</div>
                  </td>
                  <td>{a.quizTitle}</td>
                  <td>
                    <span className={`badge ${a.percentage >= 70 ? 'badge-success' : a.percentage >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                      {a.percentage}%
                    </span>
                  </td>
                  <td>{a.correct}/{a.total}</td>
                  <td>{a.timeTaken ? `${a.timeTaken}s` : '—'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formatDate(a.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

