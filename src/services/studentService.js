import api from '../config/api'

export async function getStudents() {
  const { data } = await api.get('/api/students')
  return data
}

export async function createStudent(student) {
  const { data } = await api.post('/api/students', toBody(student))
  return data
}

export async function updateStudent(id, student) {
  const { data } = await api.put(`/api/students/${id}`, toBody(student))
  return data
}

export async function deleteStudent(id) {
  await api.delete(`/api/students/${id}`)
}

function toBody(student) {
  return {
    code: student.code,
    documentNumber: student.documentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    status: student.status,
    birthDate: student.birthDate || null,
  }
}
