import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

export default function Home() {
  const { currentUser } = useAuth()

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 Quiz Builder Platform</div>
          <h1>Build. Share. <span>Learn.</span></h1>
          <p>
            Create interactive quizzes with multiple question types, track scores in real-time,
            and generate insightful reports — for education, training, or just fun.
          </p>
          <div className="hero-cta">
            {currentUser ? (
              <Link
                to={currentUser.role === 'admin' ? '/admin' : '/user'}
                className="btn btn-primary btn-lg"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card1">📊 Real-time Scores</div>
          <div className="floating-card card2">🎯 Multiple Choice</div>
          <div className="floating-card card3">⚡ True / False</div>
          <div className="floating-card card4">📝 Open Ended</div>
          <div className="hero-emoji">📝</div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Everything you need to run great quizzes</h2>
        <div className="features-grid">
          {[
            { icon: '🎨', title: 'Quiz Builder', desc: 'Create quizzes with multiple question types: MCQ, True/False, and open-ended.' },
            { icon: '🔀', title: 'Randomization', desc: 'Shuffle questions and answer choices for a unique experience every time.' },
            { icon: '⏱️', title: 'Time Limits', desc: 'Set per-quiz time limits to add excitement and challenge.' },
            { icon: '📈', title: 'Score Tracking', desc: 'Instant scoring with detailed feedback after each attempt.' },
            { icon: '📊', title: 'Reports & Analytics', desc: 'Admin dashboard with participant reports and quiz performance.' },
            { icon: '🔐', title: 'Role-Based Access', desc: 'Separate portals for Admins (quiz creators) and Users (participants).' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to start quizzing?</h2>
        <p>Join as an Admin to create quizzes, or as a User to participate.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">Create Account</Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
      </section>

      <footer className="home-footer">
        <p>📝 Quiz Builder • Built with React + Vite • 2024</p>
      </footer>
    </div>
  )
}

