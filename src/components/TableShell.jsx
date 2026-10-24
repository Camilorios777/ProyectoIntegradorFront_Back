// Tabla con el estilo del sitio. Cada pagina le pasa los encabezados y las filas.
function TableShell({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-mist/60 text-ink/70">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className={`px-4 py-3 font-medium ${header === 'Acciones' ? 'text-right' : ''}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export default TableShell
