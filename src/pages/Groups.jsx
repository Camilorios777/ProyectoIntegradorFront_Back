import { useEffect, useMemo, useState } from 'react'
import { getGroups, createGroup, updateGroup, deleteGroup } from '../services/groupService'
import { getPrograms } from '../services/programService'
import { getPeriods } from '../services/periodService'
import { getErrorMessage } from '../config/api'
import PageTitle from '../components/PageTitle'
import PrimaryButton from '../components/PrimaryButton'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'
import TableShell from '../components/TableShell'
import RowActions from '../components/RowActions'
import GroupForm from '../components/GroupForm'
import ConfirmDialog from '../components/ConfirmDialog'

function Groups() {
  const [groups, setGroups] = useState([])
  const [programs, setPrograms] = useState([])
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [groupsData, programsData, periodsData] = await Promise.all([
        getGroups(),
        getPrograms(),
        getPeriods(),
      ])
      setGroups(groupsData)
      setPrograms(programsData)
      setPeriods(periodsData)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los grupos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // El backend solo devuelve programId y periodId; aqui buscamos su nombre y codigo.
  const rows = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        programName: programs.find((p) => p.programId === group.programId)?.name ?? '—',
        periodCode: periods.find((p) => p.periodId === group.periodId)?.code ?? '—',
      })),
    [groups, programs, periods],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) =>
      [r.code, r.programName, r.periodCode, r.shift].some((field) =>
        String(field ?? '').toLowerCase().includes(term),
      ),
    )
  }, [rows, search])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(group) {
    setEditing(group)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleSubmit(form) {
    if (editing) {
      await updateGroup(editing.groupId, form)
    } else {
      await createGroup(form)
    }
    closeForm()
    await loadData()
  }

  function closeDelete() {
    setDeleteTarget(null)
    setDeleteError('')
  }

  async function confirmDelete() {
    try {
      await deleteGroup(deleteTarget.groupId)
      closeDelete()
      await loadData()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar el grupo.'))
    }
  }

  return (
    <div>
      <PageTitle
        title="Grupos"
        subtitle="Un grupo une un programa, un periodo y una jornada."
        action={
          <PrimaryButton onClick={openCreate} disabled={loading}>
            Nuevo grupo
          </PrimaryButton>
        }
      />

      <SearchBox value={search} onChange={setSearch} placeholder="Buscar por código, programa, periodo o jornada" />

      {loading ? (
        <p className="text-ink/60">Cargando grupos...</p>
      ) : error ? (
        <p className="text-sm text-rose">{error}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'No hay grupos que coincidan con la búsqueda.' : 'Aún no hay grupos. Necesitas un programa y un periodo para crear el primero.'}
        />
      ) : (
        <TableShell headers={['Código', 'Programa', 'Periodo', 'Jornada', 'Acciones']}>
          {filtered.map((group) => (
            <tr key={group.groupId} className="border-t border-line hover:bg-mist/40">
              <td className="px-4 py-3 font-medium">{group.code}</td>
              <td className="px-4 py-3">{group.programName}</td>
              <td className="px-4 py-3">{group.periodCode}</td>
              <td className="px-4 py-3">{group.shift}</td>
              <RowActions onEdit={() => openEdit(group)} onDelete={() => setDeleteTarget(group)} />
            </tr>
          ))}
        </TableShell>
      )}

      <GroupForm
        open={formOpen}
        initialData={editing}
        programs={programs}
        periods={periods}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar grupo"
        message={`¿Eliminar el grupo ${deleteTarget?.code ?? ''}? Esta acción no se puede deshacer.`}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  )
}

export default Groups
