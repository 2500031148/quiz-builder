import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'
import QuestionEditor from './QuestionEditor'

const defaultQuestion = () => ({
  id: Date.now().toString(),
  type: 'multiple-choice',
  text: '',
  options: ['', '', '', ''],
  correct: 0,
})

export default function CreateQuiz() {
  const { currentUser } = useAuth()
  const { addQuiz } = useQuiz()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    category: 'General',
    timeLimit: 10,
    randomize: false,
    questions: [defaultQuestion()],
  })

  const updateMeta = (field, value) => setQuiz(q => ({ ...q, [field]: value }))

  const addQuestion = (type = 'multiple-choice') => {
    const q = defaultQuestion()
    q.type = type
    if (type === 'true-false') q.options = ['True', 'False']
    if (type === 'open-ended') q.options = []
    setQuiz(prev => ({ ...prev, questions: [...prev.questions, q] }))
  }

  const updateQuestion = (idx, updated) => {
    const qs = [...quiz.questions]
    qs[idx] = updated
    setQuiz(prev => ({ ...prev, questions: qs }))
  }

  const deleteQuestion = (idx) => {
    setQuiz(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (quiz.questions.length === 0) return alert('Add at least one question.')
    for (const q of quiz.questions) {
      if (!q.text.trim()) return alert('All questions must have text.')
      if (q.type !== 'open-ended' && !q.options.every(o => o.trim())) {
        return alert('All options must be filled.')
      }
    }
    addQuiz({ ...quiz, createdBy: currentUser.name })
    setSaved(true)
    setTimeout(() => navigate('/admin/manage-quizzes'), 1500)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Create New Quiz ➕</h1>
          <p>Build an interactive quiz with multiple question types.</p>
        </div>
      </div>

      {saved && <div className="alert alert-success">✅ Quiz created successfully! Redirecting...</div>}

      <form onSubmit={handleSubmit}>
        {/* Quiz Metadata */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Quiz Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Quiz Title *</label>
              <input
                className="form-control" placeholder="e.g. Science Quiz 101"
                value={quiz.title}
                onChange={e => updateMeta('title', e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea
                className="form-control" placeholder="Brief description of the quiz..."
                value={quiz.description}
                onChange={e => updateMeta('description', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={quiz.category} onChange={e => updateMeta('category', e.target.value)}>
                {['General', 'Science', 'Math', 'History', 'Technology', 'Language', 'Sports', 'Entertainment'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Time Limit (minutes)</label>
              <input
                type="number" min="1" max="120" className="form-control"
                value={quiz.timeLimit}
                onChange={e => updateMeta('timeLimit', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={quiz.randomize}
                  onChange={e => updateMeta('randomize', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                🔀 Randomize question order
              </label>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Questions ({quiz.questions.length})
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => addQuestion('multiple-choice')}>
              + MCQ
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => addQuestion('true-false')}>
              + True/False
            </button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => addQuestion('open-ended')}>
              + Open Ended
            </button>
          </div>
        </div>

        {quiz.questions.map((q, idx) => (
          <QuestionEditor
            key={q.id}
            question={q}
            index={idx}
            onChange={updated => updateQuestion(idx, updated)}
            onDelete={() => deleteQuestion(idx)}
          />
        ))}

        {quiz.questions.length === 0 && (
          <div className="empty-state card">
            <div className="empty-icon">❓</div>
            <h3>No questions added yet</h3>
            <p>Click the buttons above to add questions.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary btn-lg">💾 Save Quiz</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/manage-quizzes')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

