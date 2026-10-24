import axios from 'axios'
import { clearSession, getToken } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8081',
})

// Antes de cada peticion: si hay sesion, se envia el token.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el backend responde 401 estando logueado, el token vencio o no sirve: se cierra la sesion.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/api/auth/login')
    if (error.response?.status === 401 && getToken() && !isLoginRequest) {
      clearSession()
      window.location.assign('/login?expired=1')
    }
    return Promise.reject(error)
  },
)

// Devuelve el mensaje que manda el backend (GlobalExceptionHandler) o uno claro
// si el servidor no responde.
export function getErrorMessage(err, fallback = 'Ocurrió un error.') {
  if (!err.response) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8081.'
  }
  return err.response.data?.message ?? fallback
}

export default api
