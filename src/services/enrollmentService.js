import api from '../config/api'

export async function getEnrollments() {
  const { data } = await api.get('/api/enrollments')
  return data
}

// El backend recibe studentId y groupId como parametros de la URL, no como JSON.
export async function createEnrollment({ studentId, groupId }) {
  const { data } = await api.post('/api/enrollments', null, {
    params: { studentId, groupId },
  })
  return data
}

export async function cancelEnrollment(id) {
  await api.patch(`/api/enrollments/${id}/cancel`)
}

export async function completeEnrollment(id) {
  await api.patch(`/api/enrollments/${id}/complete`)
}

export async function deleteEnrollment(id) {
  await api.delete(`/api/enrollments/${id}`)
}
