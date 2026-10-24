function RowActions({ onEdit, onDelete }) {
  return (
    <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
      <button onClick={onEdit} className="text-sm font-medium text-pine hover:underline">
        Editar
      </button>
      <button onClick={onDelete} className="text-sm font-medium text-rose hover:underline">
        Eliminar
      </button>
    </td>
  )
}

export default RowActions
