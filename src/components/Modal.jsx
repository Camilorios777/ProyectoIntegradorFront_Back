import { useEffect } from 'react'

function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-4 font-display text-xl font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal
