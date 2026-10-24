import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8081',
})

// Devuelve el mensaje que manda el backend (GlobalExceptionHandler) o uno claro
// si el servidor no responde.
export function getErrorMessage(err, fallback = 'Ocurrió un error.') {
  if (!err.response) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8081.'
  }
  return err.response.data?.message ?? fallback
}

export default api
