import { useEffect, useState } from 'react'
import Modal from './Modal'
import Field, { inputClass } from './Field'
import PrimaryButton from './PrimaryButton'
import { getErrorMessage } from '../config/api'

const emptyForm = { code: '', name: '' }

function ProgramForm({ open, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({ code: initialData.code ?? '', name: initialData.name ?? '' })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [initialData, open])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.code || !form.name) {
      setError('Código y nombre son obligatorios.')
      return
    }
    setSaving(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el programa.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={initialData ? 'Editar programa' : 'Nuevo programa'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Código">
          <input name="code" value={form.code} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Nombre">
          <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
        </Field>

        {error && <p className="text-sm text-rose">{error}</p>}

        <div className="mt-3 flex justify-end gap-2">
          <PrimaryButton variant="secondary" onClick={onCancel}>
            Cancelar
          </PrimaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

export default ProgramForm
