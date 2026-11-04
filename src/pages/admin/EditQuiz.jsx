import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuiz } from '../../context/QuizContext'
import { useAuth } from '../../context/AuthContext'
import QuestionEditor from './QuestionEditor'

const defaultQuestion = () => ({
  id: Date.now().toString(),
  type: 'multiple-choice',
  text: '',
  options: ['', '', '', ''],
  correct: 0,
})

export default function EditQuiz() {
  const { id } = useParams()
  const { getQuiz, updateQuiz } = useQuiz()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const q = getQuiz(id)
    if (!q) navigate('/admin/manage-quizzes')
    else setQuiz({ ...q })
  }, [id])

  if (!quiz) return <div className="spinner" />

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
    updateQuiz(id, quiz)
    setSaved(true)
    setTimeout(() => navigate('/admin/manage-quizzes'), 1500)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Edit Quiz ✏️</h1>
          <p>Update your quiz details and questions.</p>
        </div>
      </div>

      {saved && <div className="alert alert-success">✅ Quiz updated successfully! Redirecting...</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Quiz Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Quiz Title *</label>
              <input
                className="form-control"
                value={quiz.title}
                onChange={e => updateMeta('title', e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea
                className="form-control"
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

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Questions ({quiz.questions.length})
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => addQuestion('multiple-choice')}>+ MCQ</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => addQuestion('true-false')}>+ True/False</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => addQuestion('open-ended')}>+ Open Ended</button>
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

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary btn-lg">💾 Update Quiz</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/manage-quizzes')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

