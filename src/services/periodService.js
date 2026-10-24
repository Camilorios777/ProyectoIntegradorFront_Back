import api from '../config/api'

export async function getPeriods() {
  const { data } = await api.get('/api/periods')
  return data
}

export async function createPeriod(period) {
  const { data } = await api.post('/api/periods', toBody(period))
  return data
}

export async function updatePeriod(id, period) {
  const { data } = await api.put(`/api/periods/${id}`, toBody(period))
  return data
}

export async function deletePeriod(id) {
  await api.delete(`/api/periods/${id}`)
}

function toBody(period) {
  return {
    code: period.code,
    startDate: period.startDate,
    endDate: period.endDate,
  }
}
