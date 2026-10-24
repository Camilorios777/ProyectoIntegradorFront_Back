// Convierte "2026-10-17" (o "2026-10-17T15:36:03") en "17/10/2026".
export function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = String(value).slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
