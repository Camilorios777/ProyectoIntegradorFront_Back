import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AUTH_MODE, isAuthenticated } from '../config/auth'
import { getErrorMessage } from '../config/api'
import { demoCredentials, login } from '../services/authService'
import { inputClass } from '../components/Field'
import PrimaryButton from '../components/PrimaryButton'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const expired = new URLSearchParams(location.search).get('expired') === '1'
  const destination = location.state?.from ?? '/estudiantes'

  // Si ya hay sesion no tiene sentido mostrar el login.
  if (isAuthenticated()) {
    return <Navigate to={destination} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Escribe tu usuario y tu contraseña.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo iniciar sesión.'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-pine-dark p-12 text-paper lg:flex">
        <Link to="/" className="font-display text-xl font-semibold">
          Gestión académica
        </Link>
        <div>
          <p className="max-w-md text-balance font-display text-4xl font-semibold leading-tight">
            Todo el registro académico, ordenado y a la mano
          </p>
          <p className="mt-4 max-w-sm leading-relaxed text-paper/70">
            Inicia sesión para administrar programas, periodos, grupos, estudiantes y matrículas.
          </p>
        </div>
        <p className="text-sm text-paper/50">Proyecto integrador CESDE 2026</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="font-display text-xl font-semibold lg:hidden">
            Gestión académica
          </Link>

          <h1 className="mt-10 font-display text-3xl font-semibold tracking-tight lg:mt-0">Iniciar sesión</h1>
          <p className="mt-2 text-ink/65">Ingresa con tu usuario y tu contraseña.</p>

          {expired && (
            <p className="mt-5 rounded-md bg-straw/20 px-3 py-2 text-sm text-ink/80" role="status">
              Tu sesión venció. Inicia sesión de nuevo para continuar.
            </p>
          )}

          {AUTH_MODE === 'demo' && (
            <p className="mt-5 rounded-md border border-straw/60 bg-straw/15 px-3 py-2 text-sm leading-relaxed text-ink/80">
              Modo demostración: usuario <strong>{demoCredentials.username}</strong>, contraseña{' '}
              <strong>{demoCredentials.password}</strong>. Se valida solo en este navegador, no en el servidor.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="username" className="text-sm font-medium text-ink/80">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${inputClass} mt-1`}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-ink/80">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-pine hover:underline"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose" role="alert">
                {error}
              </p>
            )}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </PrimaryButton>
          </form>

          <p className="mt-8 text-sm text-ink/60">
            <Link to="/" className="text-pine hover:underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
