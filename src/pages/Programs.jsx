import { useEffect, useMemo, useState } from 'react'
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../services/programService'
import { getErrorMessage } from '../config/api'
import PageTitle from '../components/PageTitle'
import PrimaryButton from '../components/PrimaryButton'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'
import TableShell from '../components/TableShell'
import RowActions from '../components/RowActions'
import ProgramForm from '../components/ProgramForm'
import ConfirmDialog from '../components/ConfirmDialog'

function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  async function loadPrograms() {
    setLoading(true)
    try {
      setPrograms(await getPrograms())
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los programas.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrograms()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return programs
    return programs.filter((p) =>
      [p.code, p.name].some((field) => String(field ?? '').toLowerCase().includes(term)),
    )
  }, [programs, search])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(program) {
    setEditing(program)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleSubmit(form) {
    if (editing) {
      await updateProgram(editing.programId, form)
    } else {
      await createProgram(form)
    }
    closeForm()
    await loadPrograms()
  }

  function closeDelete() {
    setDeleteTarget(null)
    setDeleteError('')
  }

  async function confirmDelete() {
    try {
      await deleteProgram(deleteTarget.programId)
      closeDelete()
      await loadPrograms()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar el programa.'))
    }
  }

  return (
    <div>
      <PageTitle
        title="Programas"
        subtitle="Programas académicos que ofrece la institución."
        action={<PrimaryButton onClick={openCreate}>Nuevo programa</PrimaryButton>}
      />

      <SearchBox value={search} onChange={setSearch} placeholder="Buscar por código o nombre" />

      {loading ? (
        <p className="text-ink/60">Cargando programas...</p>
      ) : error ? (
        <p className="text-sm text-rose">{error}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'No hay programas que coincidan con la búsqueda.' : 'Aún no hay programas. Crea el primero con el botón de arriba.'}
        />
      ) : (
        <TableShell headers={['Código', 'Nombre', 'Acciones']}>
          {filtered.map((program) => (
            <tr key={program.programId} className="border-t border-line hover:bg-mist/40">
              <td className="px-4 py-3 font-medium">{program.code}</td>
              <td className="px-4 py-3">{program.name}</td>
              <RowActions onEdit={() => openEdit(program)} onDelete={() => setDeleteTarget(program)} />
            </tr>
          ))}
        </TableShell>
      )}

      <ProgramForm open={formOpen} initialData={editing} onSubmit={handleSubmit} onCancel={closeForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar programa"
        message={`¿Eliminar el programa ${deleteTarget?.name ?? ''}? Esta acción no se puede deshacer.`}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  )
}

export default Programs
