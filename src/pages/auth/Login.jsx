import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = login(form.email, form.password)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    // Get role from storage to redirect
    const user = JSON.parse(localStorage.getItem('quizbuilder_user') || '{}')
    navigate(user.role === 'admin' ? '/admin' : '/user')
  }

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@quiz.com', password: 'admin123' })
    else setForm({ email: 'user@quiz.com', password: 'user123' })
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">📝</span>
          <h1>QuizBuilder</h1>
          <p>Create, share and ace quizzes — your way.</p>
        </div>
        <ul className="auth-features">
          <li>✅ Build quizzes with multiple question types</li>
          <li>✅ Real-time scoring & leaderboards</li>
          <li>✅ Detailed reports for admins</li>
          <li>✅ Randomized questions for fairness</li>
        </ul>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back! 👋</h2>
          <p className="auth-subtitle">Log in to your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Demo Quick Login */}
          <div className="demo-btns">
            <span className="demo-label">Quick Demo:</span>
            <button className="btn btn-sm btn-outline" onClick={() => fillDemo('admin')}>👑 Admin</button>
            <button className="btn btn-sm btn-outline" onClick={() => fillDemo('user')}>👤 User</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
          <p className="auth-switch">
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

