import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../config/auth'

// Deja pasar solo si hay sesion; si no, manda al login y recuerda a donde queria ir.
function ProtectedRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export default ProtectedRoute
