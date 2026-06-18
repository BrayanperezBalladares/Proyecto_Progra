import { isMockApi } from '@api/config'
import { mockDelay, mockStore } from '@api/mock'
import {
  bloquearZonaHttp,
  createBloqueoHttp,
  deleteBloqueoHttp,
  getBloqueosHttp,
} from '@api/http/bloqueos.http'
import type { BloqueoMesaFormPayload } from '@api/types/domain.types'

export async function getBloqueos() {
  if (!isMockApi()) return getBloqueosHttp()
  await mockDelay()
  return mockStore.getBloqueos()
}

export async function createBloqueo(payload: BloqueoMesaFormPayload) {
  if (!isMockApi()) return createBloqueoHttp(payload)
  await mockDelay()
  return mockStore.createBloqueo(payload)
}

export async function deleteBloqueo(id: number) {
  if (!isMockApi()) return deleteBloqueoHttp(id)
  await mockDelay()
  mockStore.deleteBloqueo(id)
}

export async function bloquearZona(
  zonaId: number,
  inicio: string,
  fin: string,
  fecha: string,
  detalle: string,
) {
  if (!isMockApi()) return bloquearZonaHttp(zonaId, inicio, fin)
  await mockDelay(500)
  return mockStore.bloquearZona(zonaId, inicio, fin, fecha, detalle)
}
