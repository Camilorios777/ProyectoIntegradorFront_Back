import { useEffect, useState } from 'react'
import Modal from './Modal'
import Field, { inputClass } from './Field'
import PrimaryButton from './PrimaryButton'
import { getErrorMessage } from '../config/api'

const emptyForm = {
  code: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  status: 'true',
  birthDate: '',
}

function StudentForm({ open, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code ?? '',
        documentNumber: initialData.documentNumber ?? '',
        firstName: initialData.firstName ?? '',
        lastName: initialData.lastName ?? '',
        status: String(initialData.status ?? true),
        birthDate: initialData.birthDate ?? '',
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
    if (!form.code || !form.documentNumber || !form.firstName || !form.lastName) {
      setError('Código, documento, nombre y apellido son obligatorios.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({ ...form, status: form.status === 'true' })
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el estudiante.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={initialData ? 'Editar estudiante' : 'Nuevo estudiante'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Código">
            <input name="code" value={form.code} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Documento">
            <input
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre">
            <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Apellido">
            <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha de nacimiento">
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Estado">
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
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

export default StudentForm
