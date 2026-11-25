import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../../context/QuizContext'

const CATEGORIES = ['All', 'General', 'Science', 'Math', 'History', 'Technology', 'Language', 'Sports', 'Entertainment']

function getDifficulty(quiz) {
  const q = quiz.questions?.length || 0
  const t = quiz.timeLimit || 10
  const ratio = q / t  // questions per minute
  if (ratio >= 1.5 || q >= 15) return { label: 'Hard', color: '#dc2626', bg: '#fee2e2' }
  if (ratio >= 0.7 || q >= 7) return { label: 'Medium', color: '#d97706', bg: '#fef3c7' }
  return { label: 'Easy', color: '#16a34a', bg: '#dcfce7' }
}

export default function ManageQuizzes() {
  const { quizzes, deleteQuiz, addQuiz, getQuizAttempts } = useQuiz()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [duplicating, setDuplicating] = useState(null)

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete quiz "${title}"? This cannot be undone.`)) {
      deleteQuiz(id)
    }
  }

  const handleDuplicate = (quiz) => {
    setDuplicating(quiz.id)
    const copy = {
      ...quiz,
      title: `${quiz.title} (Copy)`,
      questions: quiz.questions.map(q => ({ ...q, id: Date.now().toString() + Math.random() })),
    }
    delete copy.id
    delete copy.createdAt
    addQuiz(copy)
    setTimeout(() => setDuplicating(null), 800)
  }

  const filtered = quizzes.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || q.category === catFilter
    return matchSearch && matchCat
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Manage Quizzes 📋</h1>
          <p>View, edit, duplicate, or delete your quizzes.</p>
        </div>
        <Link to="/admin/create-quiz" className="btn btn-primary">➕ Create New Quiz</Link>
      </div>

      {/* Search & Filter Bar */}
      {quizzes.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-control"
            style={{ flex: '1 1 220px', marginBottom: 0 }}
            placeholder="🔍 Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
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
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filtered.length} of {quizzes.length} quizzes
            </span>
          )}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No quizzes yet</h3>
          <p>Create your first quiz to get started.</p>
          <Link to="/admin/create-quiz" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Quiz
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try a different search or category filter.</p>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setCatFilter('All') }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Questions</th>
                <th>Time Limit</th>
                <th>Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(quiz => {
                const quizAttempts = getQuizAttempts(quiz.id)
                const avgScore = quizAttempts.length
                  ? Math.round(quizAttempts.reduce((s, a) => s + a.percentage, 0) / quizAttempts.length)
                  : null
                const diff = getDifficulty(quiz)
                return (
                  <tr key={quiz.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{quiz.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {quiz.description?.substring(0, 55)}{quiz.description?.length > 55 ? '...' : ''}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{quiz.category}</span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                        borderRadius: 999, background: diff.bg, color: diff.color
                      }}>
                        {diff.label}
                      </span>
                    </td>
                    <td>{quiz.questions?.length || 0}</td>
                    <td>{quiz.timeLimit} min</td>
                    <td>
                      {quizAttempts.length > 0 ? (
                        <span>
                          {quizAttempts.length}{' '}
                          <span className={`badge ${avgScore >= 70 ? 'badge-success' : 'badge-warning'}`}>
                            avg {avgScore}%
                          </span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Link to={`/admin/edit-quiz/${quiz.id}`} className="btn btn-sm btn-outline">
                          ✏️ Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDuplicate(quiz)}
                          disabled={duplicating === quiz.id}
                          title="Duplicate this quiz"
                        >
                          {duplicating === quiz.id ? '✅' : '📋'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(quiz.id, quiz.title)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

