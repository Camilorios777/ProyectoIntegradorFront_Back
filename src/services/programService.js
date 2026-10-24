import api from '../config/api'

export async function getPrograms() {
  const { data } = await api.get('/api/programs')
  return data
}

export async function createProgram(program) {
  const { data } = await api.post('/api/programs', toBody(program))
  return data
}

export async function updateProgram(id, program) {
  const { data } = await api.put(`/api/programs/${id}`, toBody(program))
  return data
}

export async function deleteProgram(id) {
  await api.delete(`/api/programs/${id}`)
}

function toBody(program) {
  return { code: program.code, name: program.name }
}
