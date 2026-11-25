/* =============================================
   Confirm Modal Component
   ============================================= */

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeInOverlay 0.15s ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem', maxWidth: 420, width: '100%',
          animation: 'scaleInModal 0.2s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
          {danger ? '🗑️' : '❓'}
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
