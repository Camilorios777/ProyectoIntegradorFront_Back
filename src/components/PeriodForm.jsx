import { useEffect, useState } from 'react'
import Modal from './Modal'
import Field, { inputClass } from './Field'
import PrimaryButton from './PrimaryButton'
import { getErrorMessage } from '../config/api'

const emptyForm = { code: '', startDate: '', endDate: '' }

function PeriodForm({ open, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code ?? '',
        startDate: initialData.startDate ?? '',
        endDate: initialData.endDate ?? '',
      })
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
    if (!form.code || !form.startDate || !form.endDate) {
      setError('Código, fecha de inicio y fecha de fin son obligatorios.')
      return
    }
    if (form.endDate < form.startDate) {
      setError('La fecha de fin no puede ser anterior a la de inicio.')
      return
    }
    setSaving(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el periodo.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={initialData ? 'Editar periodo' : 'Nuevo periodo'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Código">
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Ej: 2027-1"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Inicio">
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Fin">
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputClass} />
          </Field>
        </div>

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

export default PeriodForm
