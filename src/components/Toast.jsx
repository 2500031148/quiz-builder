/* =============================================
   Toast Notification Component
   ============================================= */
import { useEffect, useState } from 'react'

let toastQueue = []
let listeners = []

export function showToast(message, type = 'success', duration = 3000) {
  const id = Date.now() + Math.random()
  const toast = { id, message, type, duration }
  toastQueue = [...toastQueue, toast]
  listeners.forEach(fn => fn([...toastQueue]))
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id)
    listeners.forEach(fn => fn([...toastQueue]))
  }, duration)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => { listeners = listeners.filter(fn => fn !== setToasts) }
  }, [])

  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.6rem',
      zIndex: 9999, maxWidth: 360,
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.85rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            fontWeight: 600, fontSize: '0.9rem',
            animation: 'slideInToast 0.25s ease',
            background: t.type === 'success' ? '#dcfce7'
              : t.type === 'error' ? '#fee2e2'
              : t.type === 'warning' ? '#fef3c7'
              : '#e0e7ff',
            color: t.type === 'success' ? '#16a34a'
              : t.type === 'error' ? '#dc2626'
              : t.type === 'warning' ? '#d97706'
              : '#4f46e5',
            borderLeft: `4px solid ${
              t.type === 'success' ? 'var(--success)'
              : t.type === 'error' ? 'var(--danger)'
              : t.type === 'warning' ? 'var(--warning)'
              : 'var(--primary)'
            }`,
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
