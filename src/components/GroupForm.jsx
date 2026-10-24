import { useEffect, useState } from 'react'
import Modal from './Modal'
import Field, { inputClass } from './Field'
import PrimaryButton from './PrimaryButton'
import { getErrorMessage } from '../config/api'

const emptyForm = { code: '', programId: '', periodId: '', shift: 'Sabatino' }
const shifts = ['Mañana', 'Tarde', 'Noche', 'Sabatino']

function GroupForm({ open, initialData, programs, periods, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code ?? '',
        programId: String(initialData.programId ?? ''),
        periodId: String(initialData.periodId ?? ''),
        shift: initialData.shift ?? 'Sabatino',
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
    if (!form.code || !form.programId || !form.periodId) {
      setError('Código, programa y periodo son obligatorios.')
      return
    }
    setSaving(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el grupo.'))
    } finally {
      setSaving(false)
    }
  }

  const missingData = programs.length === 0 || periods.length === 0

  return (
    <Modal open={open} title={initialData ? 'Editar grupo' : 'Nuevo grupo'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {missingData && (
          <p className="rounded-md bg-straw/20 px-3 py-2 text-sm text-ink/80">
            Para crear un grupo primero necesitas al menos un programa y un periodo.
          </p>
        )}
        <Field label="Código">
          <input name="code" value={form.code} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Programa">
          <select name="programId" value={form.programId} onChange={handleChange} className={inputClass}>
            <option value="">Selecciona un programa</option>
            {programs.map((program) => (
              <option key={program.programId} value={program.programId}>
                {program.code} - {program.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Periodo">
            <select name="periodId" value={form.periodId} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona</option>
              {periods.map((period) => (
                <option key={period.periodId} value={period.periodId}>
                  {period.code}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Jornada">
            <select name="shift" value={form.shift} onChange={handleChange} className={inputClass}>
              {shifts.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
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

export default GroupForm
