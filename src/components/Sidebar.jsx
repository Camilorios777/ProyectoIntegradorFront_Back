import { Link, NavLink } from 'react-router-dom'

const items = [
  { to: '/estudiantes', label: 'Estudiantes' },
  { to: '/programas', label: 'Programas' },
  { to: '/periodos', label: 'Periodos' },
  { to: '/grupos', label: 'Grupos' },
  { to: '/matriculas', label: 'Matrículas' },
]

function Sidebar() {
  return (
    <aside className="bg-ink text-paper md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
      <div className="px-5 py-5 md:py-8">
        <Link to="/" className="font-display text-lg font-semibold">
          Gestión académica
        </Link>
        <p className="mt-1 text-xs text-paper/60">Proyecto integrador</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:pb-0">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-pine text-white' : 'text-paper/75 hover:bg-white/10'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
