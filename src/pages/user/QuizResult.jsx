import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function QuizResult() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState(null)

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('quizbuilder_attempts') || '[]')
    const found = all.find(a => a.id === id)
    if (!found || found.userId !== currentUser?.id) navigate('/user')
    else setAttempt(found)
  }, [id])

  if (!attempt) return <div className="spinner" />

  const { percentage, correct, total, quizTitle, questions, answers, timeTaken } = attempt
  const scoreClass = percentage >= 70 ? 'excellent' : percentage >= 40 ? 'good' : 'poor'
  const scoreLabel = percentage >= 70 ? '🏆 Excellent!' : percentage >= 40 ? '👍 Good Job!' : '📚 Keep Practicing!'

  return (
    <div className="page" style={{ maxWidth: 750 }}>
      {/* Score Summary */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Quiz Completed! 🎉
        </h1>
        <div className={`score-circle ${scoreClass}`}>
          <div className="score-num">{percentage}%</div>
          <div className="score-label">Score</div>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{scoreLabel}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{quizTitle}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
          {[
            ['✅', 'Correct', `${correct}/${total}`],
            ['❌', 'Incorrect', `${total - correct}/${total}`],
            ['⏱️', 'Time Taken', timeTaken ? `${Math.floor(timeTaken/60)}m ${timeTaken%60}s` : '—'],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
              <div style={{ fontSize: '1.4rem' }}>{icon}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/user" className="btn btn-primary">🏠 Dashboard</Link>
          <Link to={`/user/take-quiz/${attempt.quizId}`} className="btn btn-outline">🔄 Retake Quiz</Link>
        </div>
      </div>

      {/* Question Review */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Question Review</h2>
      {questions.map((q, idx) => {
        if (q.type === 'open-ended') {
          return (
            <div key={q.id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-warning">Q{idx + 1}</span>
                <span className="badge" style={{ background: '#fef3c7', color: '#d97706' }}>Open Ended</span>
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{q.text}</div>
              <div style={{ background: 'var(--bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                <strong>Your Answer:</strong> {answers[q.id] || <em style={{ color: 'var(--text-muted)' }}>No answer</em>}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                📝 Open-ended answers are graded manually.
              </div>
            </div>
          )
        }

        const userAns = answers[q.id]
        const isCorrect = userAns === q.correct
        const hasAnswered = userAns !== undefined

        return (
          <div key={q.id} className="card" style={{
            marginBottom: '1rem',
            borderLeft: `4px solid ${!hasAnswered ? 'var(--text-muted)' : isCorrect ? 'var(--success)' : 'var(--danger)'}`,
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <span className="badge badge-primary">Q{idx + 1}</span>
              {!hasAnswered ? (
                <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Skipped</span>
              ) : isCorrect ? (
                <span className="badge badge-success">✅ Correct</span>
              ) : (
                <span className="badge badge-danger">❌ Incorrect</span>
              )}
            </div>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{q.text}</div>
            <div>
              {q.options.map((opt, i) => {
                let style = {
                  display: 'block', padding: '0.6rem 1rem', marginBottom: '0.4rem',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', border: '2px solid transparent',
                }
                if (i === q.correct) {
                  style = { ...style, background: '#dcfce7', borderColor: 'var(--success)', color: '#16a34a', fontWeight: 700 }
                } else if (hasAnswered && i === userAns && !isCorrect) {
                  style = { ...style, background: '#fee2e2', borderColor: 'var(--danger)', color: '#dc2626' }
                } else {
                  style = { ...style, background: 'var(--bg)', borderColor: 'var(--border)' }
                }
                return (
                  <div key={i} style={style}>
                    <span style={{ fontWeight: 700, marginRight: '0.4rem' }}>{String.fromCharCode(65+i)}.</span>
                    {opt}
                    {i === q.correct && ' ✓'}
                    {hasAnswered && i === userAns && !isCorrect && ' ✗ (Your answer)'}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

