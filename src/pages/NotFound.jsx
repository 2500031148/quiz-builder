import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '1rem', animation: 'bounce 1s infinite alternate' }}>
        🔍
      </div>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.75rem 0 0.5rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 380, lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-lg">🏠 Go Home</Link>
        <button className="btn btn-outline btn-lg" onClick={() => window.history.back()}>← Go Back</button>
      </div>
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to   { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
