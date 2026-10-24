import api from '../config/api'

export async function getGroups() {
  const { data } = await api.get('/api/groups')
  return data
}

export async function createGroup(group) {
  const { data } = await api.post('/api/groups', toBody(group))
  return data
}

export async function updateGroup(id, group) {
  const { data } = await api.put(`/api/groups/${id}`, toBody(group))
  return data
}

export async function deleteGroup(id) {
  await api.delete(`/api/groups/${id}`)
}

function toBody(group) {
  return {
    code: group.code,
    programId: Number(group.programId),
    periodId: Number(group.periodId),
    shift: group.shift,
  }
}
