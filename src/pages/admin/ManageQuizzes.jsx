import { Link } from 'react-router-dom'
import { useQuiz } from '../../context/QuizContext'

export default function ManageQuizzes() {
  const { quizzes, deleteQuiz, getQuizAttempts } = useQuiz()

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete quiz "${title}"? This cannot be undone.`)) {
      deleteQuiz(id)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Manage Quizzes 📋</h1>
          <p>View, edit, or delete your quizzes.</p>
        </div>
        <Link to="/admin/create-quiz" className="btn btn-primary">➕ Create New Quiz</Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No quizzes yet</h3>
          <p>Create your first quiz to get started.</p>
          <Link to="/admin/create-quiz" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Quiz
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Category</th>
                <th>Questions</th>
                <th>Time Limit</th>
                <th>Attempts</th>
                <th>Randomize</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => {
                const attempts = getQuizAttempts(quiz.id)
                const avgScore = attempts.length
                  ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
                  : null
                return (
                  <tr key={quiz.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{quiz.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {quiz.description?.substring(0, 50)}{quiz.description?.length > 50 ? '...' : ''}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{quiz.category}</span>
                    </td>
                    <td>{quiz.questions?.length || 0}</td>
                    <td>{quiz.timeLimit} min</td>
                    <td>
                      {attempts.length > 0 ? (
                        <span>
                          {attempts.length}{' '}
                          <span className={`badge ${avgScore >= 70 ? 'badge-success' : 'badge-warning'}`}>
                            avg {avgScore}%
                          </span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None</span>
                      )}
                    </td>
                    <td>{quiz.randomize ? '✅' : '❌'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link to={`/admin/edit-quiz/${quiz.id}`} className="btn btn-sm btn-outline">
                          ✏️ Edit
                        </Link>
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

