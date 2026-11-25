import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'

// Bug #5 Fix: Fisher-Yates shuffle (uniform distribution)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TakeQuiz() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const { getQuiz, recordAttempt } = useQuiz()
  const navigate = useNavigate()

  const quiz = getQuiz(id)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const startTimeRef = useRef(null)
  const timerRef = useRef(null)
  // Bug #1 Fix: ref to guard against stale closure double-submit
  const submittedRef = useRef(false)

  useEffect(() => {
    if (!quiz) navigate('/user')
    else {
      const qs = quiz.randomize ? shuffle(quiz.questions) : [...quiz.questions]
      setQuestions(qs)
      setTimeLeft(quiz.timeLimit * 60)
    }
  }, [id])  // depend on id, not quiz object (prevents double-shuffle in StrictMode)

  // Cleanup on unmount
  useEffect(() => () => clearInterval(timerRef.current), [])

  const startQuiz = () => {
    setStarted(true)
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          // Bug #1 Fix: use ref, not state, to guard inside interval closure
          handleSubmitRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = () => {
    // Bug #1 Fix: guard with ref first, then state
    if (submittedRef.current) return
    submittedRef.current = true
    setSubmitted(true)
    clearInterval(timerRef.current)

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    let correct = 0
    let total = 0

    // Use functional form to get latest answers
    const currentAnswers = answersRef.current

    for (const q of questions) {
      if (q.type === 'open-ended') continue
      total++
      if (currentAnswers[q.id] === q.correct) correct++
    }

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    const attempt = recordAttempt({
      quizId: quiz.id,
      quizTitle: quiz.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      answers: currentAnswers,
      questions,
      correct,
      total,
      percentage,
      timeTaken,
    })

    navigate(`/user/result/${attempt.id}`)
  }

  // Keep a ref to answers so timer callback always has latest values
  const answersRef = useRef(answers)
  useEffect(() => { answersRef.current = answers }, [answers])

  // Keep ref to handleSubmit so interval can call latest version
  const handleSubmitRef = useRef(handleSubmit)
  useEffect(() => { handleSubmitRef.current = handleSubmit }, [questions, answers])

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (!quiz) return <div className="spinner" />

  // ── Pre-quiz screen ──────────────────────────────────────────────
  if (!started) {
    return (
      <div className="page" style={{ maxWidth: 650 }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{quiz.title}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{quiz.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {[
              ['❓', 'Questions', quiz.questions.length],
              ['⏱️', 'Time Limit', `${quiz.timeLimit} minutes`],
              ['📁', 'Category', quiz.category],
              ['🔀', 'Randomized', quiz.randomize ? 'Yes' : 'No'],
            ].map(([icon, label, val]) => (
              <div key={label} style={{
                background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
                padding: '1rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontWeight: 800 }}>{val}</div>
              </div>
            ))}
          </div>

          <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            ℹ️ Once started, the timer will begin. Answer all questions and click <strong>Submit Quiz</strong> when done.
          </div>

          <button className="btn btn-primary btn-lg" onClick={startQuiz} style={{ width: '100%' }}>
            🚀 Start Quiz
          </button>
        </div>
      </div>
    )
  }

  // ── Active quiz screen ───────────────────────────────────────────
  const q = questions[current]
  const answered = Object.keys(answers).length
  const progress = Math.round(((current + 1) / questions.length) * 100)
  const timerPct = Math.round((timeLeft / (quiz.timeLimit * 60)) * 100)
  const timerColor = timerPct > 50 ? 'var(--success)' : timerPct > 20 ? 'var(--warning)' : 'var(--danger)'
  const unanswered = questions.filter(q => q.type !== 'open-ended' && answers[q.id] === undefined).length

  return (
    <div className="page" style={{ maxWidth: 750 }}>
      {/* Quiz Header */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontWeight: 800 }}>{quiz.title}</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Question {current + 1} of {questions.length}
              {unanswered > 0 && (
                <span style={{ marginLeft: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>
                  · {unanswered} unanswered
                </span>
              )}
            </div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: timeLeft < 60 ? '#fee2e2' : 'var(--bg)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: `2px solid ${timerColor}`,
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TIME LEFT</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span>Progress</span><span>{answered}/{questions.filter(q => q.type !== 'open-ended').length} answered</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="badge badge-primary">Q{current + 1}</span>
          <span className="badge" style={{
            background: q.type === 'multiple-choice' ? '#e0e7ff' : q.type === 'true-false' ? '#dcfce7' : '#fef3c7',
            color: q.type === 'multiple-choice' ? '#4f46e5' : q.type === 'true-false' ? '#16a34a' : '#d97706',
          }}>
            {q.type === 'multiple-choice' ? 'MCQ' : q.type === 'true-false' ? 'True/False' : 'Open Ended'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {q.text}
        </h3>

        {q.type !== 'open-ended' ? (
          <div>
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`option-btn ${answers[q.id] === i ? 'selected' : ''}`}
                onClick={() => handleAnswer(q.id, i)}
                aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                aria-pressed={answers[q.id] === i}
              >
                <span style={{ fontWeight: 700, marginRight: '0.5rem', color: answers[q.id] === i ? 'inherit' : 'var(--text-muted)' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="form-group">
            <label>Your Answer:</label>
            <textarea
              className="form-control"
              placeholder="Type your answer here..."
              value={answers[q.id] || ''}
              onChange={e => handleAnswer(q.id, e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
        <button
          className="btn btn-outline"
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
        >
          ← Prev
        </button>

        {/* Question bubble navigator — scrollable on mobile */}
        <div style={{
          display: 'flex', gap: '0.35rem', flexWrap: 'wrap',
          justifyContent: 'center', flex: 1,
          maxHeight: 80, overflowY: 'auto',
        }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to question ${i + 1}`}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                border: '2px solid',
                borderColor: i === current ? 'var(--primary)'
                  : answers[questions[i]?.id] !== undefined ? 'var(--success)'
                  : 'var(--border)',
                background: i === current ? 'var(--primary)'
                  : answers[questions[i]?.id] !== undefined ? 'var(--success)'
                  : 'white',
                color: i === current || answers[questions[i]?.id] !== undefined ? 'white' : 'var(--text)',
                fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>
            Next →
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={handleSubmit}
            disabled={submitted}
          >
            🏁 Submit
          </button>
        )}
      </div>

      {/* Submit button always visible at bottom */}
      {current < questions.length - 1 && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={handleSubmit}
            disabled={submitted}
          >
            🏁 Submit Quiz
          </button>
        </div>
      )}
    </div>
  )
}
