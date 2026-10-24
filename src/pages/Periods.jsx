import { useEffect, useMemo, useState } from 'react'
import { getPeriods, createPeriod, updatePeriod, deletePeriod } from '../services/periodService'
import { getErrorMessage } from '../config/api'
import { formatDate } from '../config/format'
import PageTitle from '../components/PageTitle'
import PrimaryButton from '../components/PrimaryButton'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'
import TableShell from '../components/TableShell'
import RowActions from '../components/RowActions'
import PeriodForm from '../components/PeriodForm'
import ConfirmDialog from '../components/ConfirmDialog'

function Periods() {
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  async function loadPeriods() {
    setLoading(true)
    try {
      setPeriods(await getPeriods())
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los periodos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeriods()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return periods
    return periods.filter((p) => String(p.code ?? '').toLowerCase().includes(term))
  }, [periods, search])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(period) {
    setEditing(period)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleSubmit(form) {
    if (editing) {
      await updatePeriod(editing.periodId, form)
    } else {
      await createPeriod(form)
    }
    closeForm()
    await loadPeriods()
  }

  function closeDelete() {
    setDeleteTarget(null)
    setDeleteError('')
  }

  async function confirmDelete() {
    try {
      await deletePeriod(deleteTarget.periodId)
      closeDelete()
      await loadPeriods()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar el periodo.'))
    }
  }

  return (
    <div>
      <PageTitle
        title="Periodos"
        subtitle="Ciclos académicos con su fecha de inicio y de cierre."
        action={<PrimaryButton onClick={openCreate}>Nuevo periodo</PrimaryButton>}
      />

      <SearchBox value={search} onChange={setSearch} placeholder="Buscar por código" />

      {loading ? (
        <p className="text-ink/60">Cargando periodos...</p>
      ) : error ? (
        <p className="text-sm text-rose">{error}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'No hay periodos que coincidan con la búsqueda.' : 'Aún no hay periodos. Crea el primero con el botón de arriba.'}
        />
      ) : (
        <TableShell headers={['Código', 'Inicio', 'Fin', 'Acciones']}>
          {filtered.map((period) => (
            <tr key={period.periodId} className="border-t border-line hover:bg-mist/40">
              <td className="px-4 py-3 font-medium">{period.code}</td>
              <td className="px-4 py-3">{formatDate(period.startDate)}</td>
              <td className="px-4 py-3">{formatDate(period.endDate)}</td>
              <RowActions onEdit={() => openEdit(period)} onDelete={() => setDeleteTarget(period)} />
            </tr>
          ))}
        </TableShell>
      )}

      <PeriodForm open={formOpen} initialData={editing} onSubmit={handleSubmit} onCancel={closeForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar periodo"
        message={`¿Eliminar el periodo ${deleteTarget?.code ?? ''}? Esta acción no se puede deshacer.`}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  )
}

export default Periods
