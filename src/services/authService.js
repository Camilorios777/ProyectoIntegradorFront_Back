import api from '../config/api'
import { AUTH_MODE, clearSession, saveSession } from '../config/auth'

// Usuario de prueba del modo demo. Solo existe en el navegador: no es seguridad real.
export const demoCredentials = { username: 'admin', password: 'admin123' }
const DEMO_SESSION_SECONDS = 8 * 60 * 60

// Mismo formato de error que devuelve axios, para reutilizar getErrorMessage.
function invalidCredentials() {
  const error = new Error('Usuario o contrasena incorrectos')
  error.response = { status: 401, data: { message: error.message } }
  return error
}

export async function login(username, password) {
  if (AUTH_MODE === 'demo') {
    await new Promise((resolve) => setTimeout(resolve, 400))
    if (username !== demoCredentials.username || password !== demoCredentials.password) {
      throw invalidCredentials()
    }
    saveSession({
      token: 'demo-token',
      user: { username: demoCredentials.username, email: 'admin@demo.local' },
      roles: ['ADMIN'],
      expiresInSeconds: DEMO_SESSION_SECONDS,
    })
    return
  }

  // Modo api: el backend devuelve { token, user, roles, expiresInSeconds }.
  const { data } = await api.post('/api/auth/login', { username, password })
  saveSession({
    token: data.token,
    user: data.user,
    roles: data.roles,
    expiresInSeconds: data.expiresInSeconds,
  })
}

export function logout() {
  clearSession()
}
