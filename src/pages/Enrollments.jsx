import { useEffect, useMemo, useState } from 'react'
import {
  getEnrollments,
  createEnrollment,
  cancelEnrollment,
  completeEnrollment,
  deleteEnrollment,
} from '../services/enrollmentService'
import { getStudents } from '../services/studentService'
import { getGroups } from '../services/groupService'
import { getErrorMessage } from '../config/api'
import { formatDate } from '../config/format'
import PageTitle from '../components/PageTitle'
import PrimaryButton from '../components/PrimaryButton'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'
import TableShell from '../components/TableShell'
import EnrollmentForm from '../components/EnrollmentForm'
import ConfirmDialog from '../components/ConfirmDialog'

const statusStyles = {
  ACTIVE: 'bg-pine/15 text-pine-dark',
  COMPLETED: 'bg-harbor/20 text-ink',
  CANCELLED: 'bg-rose/15 text-rose',
}

const statusLabels = {
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
}

function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [students, setStudents] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [enrollmentsData, studentsData, groupsData] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getGroups(),
      ])
      setEnrollments(enrollmentsData)
      setStudents(studentsData)
      setGroups(groupsData)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las matrículas.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // El backend solo devuelve studentId y groupId; aqui buscamos el estudiante y el grupo.
  const rows = useMemo(
    () =>
      enrollments.map((enrollment) => {
        const student = students.find((s) => s.userID === enrollment.studentId)
        const group = groups.find((g) => g.groupId === enrollment.groupId)
        return {
          ...enrollment,
          studentName: student ? `${student.firstName} ${student.lastName}` : '—',
          groupLabel: group ? `${group.code} - ${group.shift}` : '—',
        }
      }),
    [enrollments, students, groups],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(
      (r) => r.studentName.toLowerCase().includes(term) || r.groupLabel.toLowerCase().includes(term),
    )
  }, [rows, search])

  async function handleSubmit({ studentId, groupId }) {
    await createEnrollment({ studentId, groupId })
    setFormOpen(false)
    await loadData()
  }

  async function handleChangeStatus(enrollment, status) {
    setActionError('')
    try {
      if (status === 'COMPLETED') {
        await completeEnrollment(enrollment.enrollmentId)
      } else {
        await cancelEnrollment(enrollment.enrollmentId)
      }
      await loadData()
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo cambiar el estado de la matrícula.'))
    }
  }

  function closeDelete() {
    setDeleteTarget(null)
    setDeleteError('')
  }

  async function confirmDelete() {
    try {
      await deleteEnrollment(deleteTarget.enrollmentId)
      closeDelete()
      await loadData()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar la matrícula.'))
    }
  }

  return (
    <div>
      <PageTitle
        title="Matrículas"
        subtitle="Estudiantes inscritos en cada grupo."
        action={
          <PrimaryButton onClick={() => setFormOpen(true)} disabled={loading}>
            Nueva matrícula
          </PrimaryButton>
        }
      />

      <SearchBox value={search} onChange={setSearch} placeholder="Buscar por estudiante o grupo" />

      {actionError && <p className="mb-3 text-sm text-rose">{actionError}</p>}

      {loading ? (
        <p className="text-ink/60">Cargando matrículas...</p>
      ) : error ? (
        <p className="text-sm text-rose">{error}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'No hay matrículas que coincidan con la búsqueda.' : 'Aún no hay matrículas. Necesitas un estudiante y un grupo para crear la primera.'}
        />
      ) : (
        <TableShell headers={['Estudiante', 'Grupo', 'Fecha', 'Estado', 'Acciones']}>
          {filtered.map((enrollment) => (
            <tr key={enrollment.enrollmentId} className="border-t border-line hover:bg-mist/40">
              <td className="px-4 py-3 font-medium">{enrollment.studentName}</td>
              <td className="px-4 py-3">{enrollment.groupLabel}</td>
              <td className="px-4 py-3">{formatDate(enrollment.enrolledAt)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[enrollment.status] ?? 'bg-mist'}`}
                >
                  {statusLabels[enrollment.status] ?? enrollment.status}
                </span>
              </td>
              <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
                {enrollment.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => handleChangeStatus(enrollment, 'COMPLETED')}
                      className="text-sm font-medium text-pine hover:underline"
                    >
                      Completar
                    </button>
                    <button
                      onClick={() => handleChangeStatus(enrollment, 'CANCELLED')}
                      className="text-sm font-medium text-harbor hover:underline"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                <button
                  onClick={() => setDeleteTarget(enrollment)}
                  className="text-sm font-medium text-rose hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </TableShell>
      )}

      <EnrollmentForm
        open={formOpen}
        students={students}
        groups={groups}
        onSubmit={handleSubmit}
        onCancel={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar matrícula"
        message="¿Eliminar esta matrícula? Esta acción no se puede deshacer."
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  )
}

export default Enrollments
