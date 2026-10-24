import Modal from './Modal'
import PrimaryButton from './PrimaryButton'

function ConfirmDialog({ open, title, message, error, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-ink/75">{message}</p>
      {error && <p className="mt-3 text-sm text-rose">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <PrimaryButton variant="secondary" onClick={onCancel}>
          Cancelar
        </PrimaryButton>
        <PrimaryButton onClick={onConfirm}>Eliminar</PrimaryButton>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
