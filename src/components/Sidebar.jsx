import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getRoles, getUser } from '../config/auth'
import { logout } from '../services/authService'

const items = [
  { to: '/estudiantes', label: 'Estudiantes' },
  { to: '/programas', label: 'Programas' },
  { to: '/periodos', label: 'Periodos' },
  { to: '/grupos', label: 'Grupos' },
  { to: '/matriculas', label: 'Matrículas' },
]

function Sidebar() {
  const navigate = useNavigate()
  const user = getUser()
  const roles = getRoles()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex flex-col bg-ink text-paper md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
      <div className="flex items-start justify-between px-5 py-5 md:block md:py-8">
        <div>
          <Link to="/" className="font-display text-lg font-semibold">
            Gestión académica
          </Link>
          <p className="mt-1 text-xs text-paper/60">Proyecto integrador</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-paper/70 hover:text-white md:hidden">
          Cerrar sesión
        </button>
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

      <div className="mt-auto hidden border-t border-white/10 p-4 md:block">
        {user && (
          <div className="mb-3">
            <p className="truncate text-sm font-medium">{user.username}</p>
            {roles.length > 0 && <p className="truncate text-xs text-paper/55">{roles.join(', ')}</p>}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full rounded-md border border-white/20 px-3 py-2 text-sm text-paper/80 transition-colors hover:bg-white/10"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
