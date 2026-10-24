import { useEffect, useState } from 'react'
import Modal from './Modal'
import Field, { inputClass } from './Field'
import PrimaryButton from './PrimaryButton'
import { getErrorMessage } from '../config/api'

function EnrollmentForm({ open, students, groups, onSubmit, onCancel }) {
  const [studentId, setStudentId] = useState('')
  const [groupId, setGroupId] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setStudentId('')
      setGroupId('')
      setError('')
    }
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!studentId || !groupId) {
      setError('Selecciona un estudiante y un grupo.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({ studentId: Number(studentId), groupId: Number(groupId) })
    } catch (err) {
      // Aqui llegan los mensajes reales del backend: matricula duplicada, estudiante no encontrado, etc.
      setError(getErrorMessage(err, 'No se pudo crear la matrícula.'))
    } finally {
      setSaving(false)
    }
  }

  const missingData = students.length === 0 || groups.length === 0

  return (
    <Modal open={open} title="Nueva matrícula" onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {missingData && (
          <p className="rounded-md bg-straw/20 px-3 py-2 text-sm text-ink/80">
            Para matricular necesitas al menos un estudiante y un grupo.
          </p>
        )}
        <Field label="Estudiante">
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass}>
            <option value="">Selecciona un estudiante</option>
            {students.map((student) => (
              <option key={student.userID} value={student.userID}>
                {student.code} - {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Grupo">
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className={inputClass}>
            <option value="">Selecciona un grupo</option>
            {groups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.code} - {group.shift}
              </option>
            ))}
          </select>
        </Field>

        {error && <p className="text-sm text-rose">{error}</p>}

        <div className="mt-3 flex justify-end gap-2">
          <PrimaryButton variant="secondary" onClick={onCancel}>
            Cancelar
          </PrimaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Matriculando...' : 'Matricular'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

export default EnrollmentForm
