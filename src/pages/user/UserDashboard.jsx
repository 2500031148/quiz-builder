import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'

const CATEGORIES = ['All', 'General', 'Science', 'Math', 'History', 'Technology', 'Language', 'Sports', 'Entertainment']

function getDifficulty(quiz) {
  const q = quiz.questions?.length || 0
  const t = quiz.timeLimit || 10
  const ratio = q / t
  if (ratio >= 1.5 || q >= 15) return { label: 'Hard', color: '#dc2626', bg: '#fee2e2' }
  if (ratio >= 0.7 || q >= 7) return { label: 'Medium', color: '#d97706', bg: '#fef3c7' }
  return { label: 'Easy', color: '#16a34a', bg: '#dcfce7' }
}

export default function UserDashboard() {
  const { currentUser } = useAuth()
  const { quizzes, getUserAttempts } = useQuiz()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const myAttempts = getUserAttempts(currentUser?.id)
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

  const filtered = quizzes
    .filter(q => {
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description?.toLowerCase().includes(search.toLowerCase())
      const matchCat = catFilter === 'All' || q.category === catFilter
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'az') return a.title.localeCompare(b.title)
      if (sortBy === 'questions') return (b.questions?.length || 0) - (a.questions?.length || 0)
      return 0
    })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {currentUser?.name}! 🎓</h1>
          <p>Pick a quiz and start testing your knowledge.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/user/leaderboard" className="btn btn-secondary">🏆 Leaderboard</Link>
          <Link to="/user/history" className="btn btn-outline">📜 My History</Link>
        </div>
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

      {/* Search, Filter & Sort */}
      {quizzes.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input
              className="form-control"
              style={{ flex: '1 1 220px', marginBottom: 0 }}
              placeholder="🔍 Search quizzes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="form-control"
              style={{ width: 'auto', marginBottom: 0 }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="az">Sort: A–Z</option>
              <option value="questions">Sort: Most Questions</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`btn btn-sm ${catFilter === c ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          {(search || catFilter !== 'All') && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filtered.length} of {quizzes.length} quizzes
              <button
                style={{ marginLeft: '0.75rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                onClick={() => { setSearch(''); setCatFilter('All') }}
              >
                Clear ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Header */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Available Quizzes</h2>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No quizzes available yet</h3>
          <p>Ask your admin to create some quizzes.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🔍</div>
          <h3>No quizzes match your search</h3>
          <p>Try different keywords or category filters.</p>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setCatFilter('All') }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map(quiz => {
            const userAttempts = myAttempts.filter(a => a.quizId === quiz.id)
            const lastAttempt = userAttempts[userAttempts.length - 1]
            const taken = userAttempts.length > 0
            const diff = getDifficulty(quiz)

            return (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ flex: 1, paddingRight: '0.5rem' }}>{quiz.title}</h3>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem',
                      borderRadius: 999, background: diff.bg, color: diff.color, flexShrink: 0,
                    }}>
                      {diff.label}
                    </span>
                  </div>
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
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Last attempt</span>
                        <span style={{ fontWeight: 700, color: lastAttempt.percentage >= 70 ? '#16a34a' : lastAttempt.percentage >= 40 ? '#d97706' : '#dc2626' }}>
                          {lastAttempt.percentage}%
                        </span>
                      </div>
                      <div style={{ background: '#e2e8f0', borderRadius: 999, height: 6, overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{
                          height: '100%',
                          width: `${lastAttempt.percentage}%`,
                          background: lastAttempt.percentage >= 70 ? 'var(--success)' : lastAttempt.percentage >= 40 ? 'var(--warning)' : 'var(--danger)',
                          borderRadius: 999,
                        }} />
                      </div>
                      {userAttempts.length > 1 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Attempted {userAttempts.length} times
                        </div>
                      )}
                    </div>
                  )}

                  <div className="quiz-actions">
                    <Link to={`/user/take-quiz/${quiz.id}`} className="btn btn-primary btn-sm">
                      {taken ? '🔄 Retake Quiz' : '▶️ Start Quiz'}
                    </Link>
                    {taken && lastAttempt && (
                      <Link to={`/user/result/${lastAttempt.id}`} className="btn btn-outline btn-sm">
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
