import { useState } from 'react'
import { useQuiz } from '../../context/QuizContext'
import { showToast } from '../../components/Toast'

export default function AdminReports() {
  const { quizzes, attempts } = useQuiz()
  const [openEndedModal, setOpenEndedModal] = useState(null) // attempt object

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

  const exportCSV = () => {
    const headers = ['Participant', 'Email', 'Quiz', 'Score (%)', 'Correct', 'Total', 'Time Taken (s)', 'Status', 'Completed At']
    const rows = sortedAttempts.map(a => [
      a.userName, a.userEmail, a.quizTitle, a.percentage,
      a.correct, a.total, a.timeTaken ?? '',
      a.percentage >= 60 ? 'Pass' : 'Fail',
      new Date(a.completedAt).toLocaleString(),
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-reports-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV exported successfully!', 'success')
  }

  // Count open-ended questions in an attempt
  const openEndedCount = (a) => a.questions?.filter(q => q.type === 'open-ended').length || 0

  return (
    <div className="page">
      {/* Open-ended answer review modal */}
      {openEndedModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setOpenEndedModal(null)}
        >
          <div
            style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', padding: '2rem', maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>📝 Open-Ended Answers</h2>
              <button onClick={() => setOpenEndedModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {openEndedModal.userName} · {openEndedModal.quizTitle}
            </div>
            {openEndedModal.questions?.filter(q => q.type === 'open-ended').map((q) => (
              <div key={q.id} style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Q: {q.text}</div>
                <div style={{ background: 'var(--bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                  {openEndedModal.answers?.[q.id] || <em style={{ color: 'var(--text-muted)' }}>No answer given</em>}
                </div>
              </div>
            ))}
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setOpenEndedModal(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Reports & Analytics 📊</h1>
          <p>Overview of quiz performance and participant activity.</p>
        </div>
        {attempts.length > 0 && (
          <button className="btn btn-secondary" onClick={exportCSV}>
            ⬇️ Export CSV
          </button>
        )}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: '#e2e8f0', borderRadius: 999, height: 8, width: 100, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.round((q.passed / q.attempts.length) * 100)}%`,
                              background: 'var(--success)',
                              borderRadius: 999,
                            }}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>All Attempts</h2>
          {attempts.length > 0 && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{attempts.length} total</span>
          )}
        </div>
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
                <th>Status</th>
                <th>Completed At</th>
                <th>Open-Ended</th>
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
                  <td>{a.timeTaken ? `${Math.floor(a.timeTaken / 60)}m ${a.timeTaken % 60}s` : '—'}</td>
                  <td>
                    <span className={`badge ${a.percentage >= 60 ? 'badge-success' : 'badge-danger'}`}>
                      {a.percentage >= 60 ? '✅ Pass' : '❌ Fail'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formatDate(a.completedAt)}</td>
                  <td>
                    {openEndedCount(a) > 0 ? (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setOpenEndedModal(a)}
                        style={{ fontSize: '0.78rem' }}
                      >
                        📝 View ({openEndedCount(a)})
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
