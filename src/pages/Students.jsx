import { useEffect, useMemo, useState } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService'
import { getErrorMessage } from '../config/api'
import { formatDate } from '../config/format'
import PageTitle from '../components/PageTitle'
import PrimaryButton from '../components/PrimaryButton'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'
import TableShell from '../components/TableShell'
import RowActions from '../components/RowActions'
import StudentForm from '../components/StudentForm'
import ConfirmDialog from '../components/ConfirmDialog'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  async function loadStudents() {
    setLoading(true)
    try {
      setStudents(await getStudents())
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los estudiantes.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students
    return students.filter((s) =>
      [s.code, s.documentNumber, s.firstName, s.lastName].some((field) =>
        String(field ?? '').toLowerCase().includes(term),
      ),
    )
  }, [students, search])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(student) {
    setEditing(student)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleSubmit(form) {
    if (editing) {
      await updateStudent(editing.userID, form)
    } else {
      await createStudent(form)
    }
    closeForm()
    await loadStudents()
  }

  function closeDelete() {
    setDeleteTarget(null)
    setDeleteError('')
  }

  async function confirmDelete() {
    try {
      await deleteStudent(deleteTarget.userID)
      closeDelete()
      await loadStudents()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar el estudiante.'))
    }
  }

  return (
    <div>
      <PageTitle
        title="Estudiantes"
        subtitle="Personas registradas en la institución."
        action={<PrimaryButton onClick={openCreate}>Nuevo estudiante</PrimaryButton>}
      />

      <SearchBox value={search} onChange={setSearch} placeholder="Buscar por nombre, código o documento" />

      {loading ? (
        <p className="text-ink/60">Cargando estudiantes...</p>
      ) : error ? (
        <p className="text-sm text-rose">{error}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'No hay estudiantes que coincidan con la búsqueda.' : 'Aún no hay estudiantes. Crea el primero con el botón de arriba.'}
        />
      ) : (
        <TableShell headers={['Código', 'Documento', 'Nombre', 'Nacimiento', 'Estado', 'Acciones']}>
          {filtered.map((student) => (
            <tr key={student.userID} className="border-t border-line hover:bg-mist/40">
              <td className="px-4 py-3 font-medium">{student.code}</td>
              <td className="px-4 py-3">{student.documentNumber}</td>
              <td className="px-4 py-3">
                {student.firstName} {student.lastName}
              </td>
              <td className="px-4 py-3">{formatDate(student.birthDate)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    student.status ? 'bg-pine/15 text-pine-dark' : 'bg-mist text-ink/60'
                  }`}
                >
                  {student.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <RowActions onEdit={() => openEdit(student)} onDelete={() => setDeleteTarget(student)} />
            </tr>
          ))}
        </TableShell>
      )}

      <StudentForm open={formOpen} initialData={editing} onSubmit={handleSubmit} onCancel={closeForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar estudiante"
        message={`¿Eliminar a ${deleteTarget?.firstName ?? ''} ${deleteTarget?.lastName ?? ''}? Esta acción no se puede deshacer.`}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  )
}

export default Students
