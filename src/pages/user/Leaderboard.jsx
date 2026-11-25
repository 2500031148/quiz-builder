import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../../context/QuizContext'
import { useAuth } from '../../context/AuthContext'

export default function Leaderboard() {
  const { quizzes, attempts } = useQuiz()
  const { currentUser } = useAuth()
  const [selectedQuiz, setSelectedQuiz] = useState('all')

  // Build leaderboard entries
  const getLeaderboard = () => {
    const filtered = selectedQuiz === 'all'
      ? attempts
      : attempts.filter(a => a.quizId === selectedQuiz)

    // Best attempt per user (per quiz if filtered, globally if 'all')
    const bestByUser = {}
    filtered.forEach(a => {
      const key = selectedQuiz === 'all' ? a.userId : `${a.userId}-${a.quizId}`
      if (!bestByUser[key] || a.percentage > bestByUser[key].percentage) {
        bestByUser[key] = a
      }
    })

    return Object.values(bestByUser)
      .sort((a, b) => b.percentage - a.percentage || a.timeTaken - b.timeTaken)
      .slice(0, 20)
  }

  const board = getLeaderboard()

  const getMedal = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `#${rank + 1}`
  }

  const getRankStyle = (rank) => {
    if (rank === 0) return { background: 'linear-gradient(135deg, #fef9c3, #fde68a)', borderLeft: '4px solid #f59e0b' }
    if (rank === 1) return { background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderLeft: '4px solid #94a3b8' }
    if (rank === 2) return { background: 'linear-gradient(135deg, #fff7ed, #fed7aa)', borderLeft: '4px solid #f97316' }
    return {}
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>🏆 Leaderboard</h1>
          <p>Top performers across all quizzes. Can you make the list?</p>
        </div>
        <Link to="/user" className="btn btn-outline">🏠 Dashboard</Link>
      </div>

      {/* Quiz Selector */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>📋 Filter by Quiz:</span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${selectedQuiz === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedQuiz('all')}
          >
            All Quizzes
          </button>
          {quizzes.map(q => (
            <button
              key={q.id}
              className={`btn btn-sm ${selectedQuiz === q.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedQuiz(q.id)}
            >
              {q.title}
            </button>
          ))}
        </div>
      </div>

      {board.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🏆</div>
          <h3>No attempts yet</h3>
          <p>Be the first to complete a quiz and claim the top spot!</p>
          <Link to="/user" className="btn btn-primary" style={{ marginTop: '1rem' }}>Take a Quiz</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {board.map((entry, idx) => {
            const isMe = entry.userId === currentUser?.id
            return (
              <div
                key={`${entry.userId}-${entry.quizId}-${idx}`}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  padding: '1rem 1.5rem',
                  ...getRankStyle(idx),
                  ...(isMe ? { outline: '2px solid var(--primary)' } : {}),
                }}
              >
                {/* Rank */}
                <div style={{
                  minWidth: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: idx < 3 ? 'transparent' : 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: idx < 3 ? '1.8rem' : '0.95rem',
                  fontWeight: 800,
                  color: idx < 3 ? undefined : 'var(--primary)',
                }}>
                  {getMedal(idx)}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: isMe ? 'var(--primary)' : '#e2e8f0',
                  color: isMe ? 'white' : 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                }}>
                  {entry.userName?.[0]?.toUpperCase() || '?'}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {entry.userName} {isMe && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>(You)</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedQuiz === 'all' ? entry.quizTitle : ''}
                    {entry.timeTaken ? ` · ⏱ ${Math.floor(entry.timeTaken / 60)}m ${entry.timeTaken % 60}s` : ''}
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ flex: 1, maxWidth: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{entry.correct}/{entry.total} correct</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${entry.percentage}%`,
                      background: entry.percentage >= 70 ? 'var(--success)' : entry.percentage >= 40 ? 'var(--warning)' : 'var(--danger)',
                      borderRadius: 999,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>

                {/* Score badge */}
                <div>
                  <span className={`badge ${entry.percentage >= 70 ? 'badge-success' : entry.percentage >= 40 ? 'badge-warning' : 'badge-danger'}`}
                    style={{ fontSize: '1rem', padding: '0.4rem 0.9rem' }}>
                    {entry.percentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Your rank callout */}
      {board.length > 0 && (() => {
        const myRank = board.findIndex(e => e.userId === currentUser?.id)
        if (myRank === -1) return (
          <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
            💡 You haven't taken any quizzes yet. Take one to appear on the leaderboard!
          </div>
        )
        return null
      })()}
    </div>
  )
}
