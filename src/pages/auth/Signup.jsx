import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../components/Toast'
import './Auth.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const result = signup(form.name, form.email, form.password, form.role)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    showToast('Account created successfully! 🎉', 'success')
    navigate(form.role === 'admin' ? '/admin' : '/user')
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">📝</span>
          <h1>QuizBuilder</h1>
          <p>Join thousands of learners and educators.</p>
        </div>
        <ul className="auth-features">
          <li>🎓 Perfect for schools & training</li>
          <li>🏆 Competitive real-time quizzes</li>
          <li>📊 Track progress & performance</li>
          <li>🔐 Secure local authentication</li>
        </ul>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account 🚀</h2>
          <p className="auth-subtitle">Sign up to start quizzing</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>I am signing up as</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-opt ${form.role === 'user' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'user' })}
                >
                  <span>👤</span> User
                  <small>Take quizzes & track progress</small>
                </button>
                <button
                  type="button"
                  className={`role-opt ${form.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'admin' })}
                >
                  <span>👑</span> Admin
                  <small>Create & manage quizzes</small>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
          <p className="auth-switch">
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

