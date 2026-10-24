// Manejo de la sesion en el navegador (localStorage).
const STORAGE_KEY = 'gestion-academica.session'

// "demo" valida el login en el navegador; cualquier otro valor usa el backend.
export const AUTH_MODE = import.meta.env.VITE_AUTH_MODE === 'demo' ? 'demo' : 'api'

export function saveSession({ token, user, roles, expiresInSeconds }) {
  const session = {
    token,
    user,
    roles: roles ?? [],
    expiresAt: Date.now() + expiresInSeconds * 1000,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Si el almacenamiento no esta disponible, simplemente no se guarda la sesion.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nada que limpiar.
  }
}

// Devuelve la sesion guardada, o null si no existe o ya vencio.
export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session.token || session.expiresAt <= Date.now()) {
      clearSession()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function getToken() {
  return getSession()?.token ?? null
}

export function getUser() {
  return getSession()?.user ?? null
}

export function getRoles() {
  return getSession()?.roles ?? []
}

export function isAuthenticated() {
  return getSession() !== null
}
