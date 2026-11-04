import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'

export default function UserDashboard() {
  const { currentUser } = useAuth()
  const { quizzes, getUserAttempts } = useQuiz()

  const myAttempts = getUserAttempts(currentUser?.id)
  const attemptedIds = new Set(myAttempts.map(a => a.quizId))
  const avgScore = myAttempts.length
    ? Math.round(myAttempts.reduce((s, a) => s + a.percentage, 0) / myAttempts.length)
    : 0
  const bestScore = myAttempts.length
    ? Math.max(...myAttempts.map(a => a.percentage))
    : 0

  const stats = [
    { icon: '📋', label: 'Available Quizzes', value: quizzes.length, bg: '#e0e7ff', color: '#4f46e5' },
    { icon: '✅', label: 'Quizzes Taken', value: myAttempts.length, bg: '#dcfce7', color: '#16a34a' },
    { icon: '⭐', label: 'Avg. Score', value: `${avgScore}%`, bg: '#fef3c7', color: '#d97706' },
    { icon: '🏆', label: 'Best Score', value: `${bestScore}%`, bg: '#fee2e2', color: '#dc2626' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {currentUser?.name}! 🎓</h1>
          <p>Pick a quiz and start testing your knowledge.</p>
        </div>
        <Link to="/user/history" className="btn btn-outline">📜 My History</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz List */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Available Quizzes</h2>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No quizzes available yet</h3>
          <p>Ask your admin to create some quizzes.</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map(quiz => {
            const userAttempt = myAttempts.filter(a => a.quizId === quiz.id)
            const lastAttempt = userAttempt[userAttempt.length - 1]
            const taken = userAttempt.length > 0

            return (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-card-header">
                  <h3>{quiz.title}</h3>
                  <div style={{ opacity: 0.8, fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {quiz.description?.substring(0, 80)}{quiz.description?.length > 80 ? '...' : ''}
                  </div>
                </div>
                <div className="quiz-card-body">
                  <div className="quiz-meta">
                    <span>❓ {quiz.questions?.length || 0} Questions</span>
                    <span>⏱️ {quiz.timeLimit} min</span>
                    <span>📁 {quiz.category}</span>
                    {quiz.randomize && <span>🔀 Randomized</span>}
                  </div>

                  {taken && lastAttempt && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: lastAttempt.percentage >= 70 ? '#dcfce7' : lastAttempt.percentage >= 40 ? '#fef3c7' : '#fee2e2',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      <span>Last attempt:</span>
                      <span style={{
                        color: lastAttempt.percentage >= 70 ? '#16a34a' : lastAttempt.percentage >= 40 ? '#d97706' : '#dc2626'
                      }}>
                        {lastAttempt.percentage}% ({lastAttempt.correct}/{lastAttempt.total})
                      </span>
                    </div>
                  )}

                  <div className="quiz-actions">
                    <Link
                      to={`/user/take-quiz/${quiz.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      {taken ? '🔄 Retake Quiz' : '▶️ Start Quiz'}
                    </Link>
                    {taken && lastAttempt && (
                      <Link
                        to={`/user/result/${lastAttempt.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        📊 Last Result
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

