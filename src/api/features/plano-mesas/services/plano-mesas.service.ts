import { isMockApi } from '@api/config'
import { mockDelay, mockStore } from '@api/mock'
import { fetchPlanoSalonHttp } from '@api/http/plano-mesas.http'
import type { PlanoSalonParams } from '@api/types/plano-mesas.types'

export async function getPlanoSalon(params: PlanoSalonParams) {
  if (isMockApi()) {
    await mockDelay()
    return mockStore.getPlanoSalon(params.fecha, params.turnoId)
  }
  return fetchPlanoSalonHttp(params)
}
