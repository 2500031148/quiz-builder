export default function QuestionEditor({ question, index, onChange, onDelete }) {
  const updateField = (field, value) => onChange({ ...question, [field]: value })

  const updateOption = (i, value) => {
    const opts = [...question.options]
    opts[i] = value
    onChange({ ...question, options: opts })
  }

  const typeColors = {
    'multiple-choice': { bg: '#e0e7ff', color: '#4f46e5', label: 'MCQ' },
    'true-false': { bg: '#dcfce7', color: '#16a34a', label: 'T/F' },
    'open-ended': { bg: '#fef3c7', color: '#d97706', label: 'Open' },
  }
  const tc = typeColors[question.type]

  return (
    <div className="card" style={{ marginBottom: '1rem', borderLeft: `4px solid ${tc.color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            background: tc.bg, color: tc.color, fontWeight: 700,
            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem'
          }}>
            Q{index + 1} · {tc.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onDelete}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--danger)', fontSize: '1.1rem', padding: '0.2rem'
          }}
        >
          🗑️
        </button>
      </div>

      <div className="form-group">
        <label>Question Text *</label>
        <textarea
          className="form-control"
          placeholder="Enter your question here..."
          value={question.text}
          onChange={e => updateField('text', e.target.value)}
          style={{ minHeight: '70px' }}
          required
        />
      </div>

      {question.type === 'multiple-choice' && (
        <div>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
            Options (select the correct answer)
          </label>
          {question.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correct === i}
                onChange={() => updateField('correct', i)}
                style={{ width: 'auto', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <input
                type="text"
                className="form-control"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                style={{ flex: 1 }}
              />
              {question.correct === i && (
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
              )}
            </div>
          ))}
          <small style={{ color: 'var(--text-muted)' }}>🔘 Select the radio button next to the correct answer.</small>
        </div>
      )}

      {question.type === 'true-false' && (
        <div>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
            Correct Answer
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['True', 'False'].map((opt, i) => (
              <label key={opt} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                cursor: 'pointer', fontWeight: 600,
                padding: '0.5rem 1.2rem',
                border: `2px solid ${question.correct === i ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                background: question.correct === i ? 'var(--primary-light)' : 'white',
                color: question.correct === i ? 'var(--primary)' : 'var(--text)',
              }}>
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correct === i}
                  onChange={() => updateField('correct', i)}
                  style={{ display: 'none' }}
                />
                {opt === 'True' ? '✅' : '❌'} {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      {question.type === 'open-ended' && (
        <div className="alert alert-info">
          📝 Open-ended questions are graded manually. Students will type their answer during the quiz.
        </div>
      )}
    </div>
  )
}

