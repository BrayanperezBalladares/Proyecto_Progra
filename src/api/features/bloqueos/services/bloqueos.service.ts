import { mockDelay, mockStore } from '@api/mock'
import type { BloqueoMesaFormPayload } from '@api/types/domain.types'

export async function getBloqueos() {
  await mockDelay()
  return mockStore.getBloqueos()
}

export async function createBloqueo(payload: BloqueoMesaFormPayload) {
  await mockDelay()
  return mockStore.createBloqueo(payload)
}

export async function deleteBloqueo(id: number) {
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
  await mockDelay(500)
  return mockStore.bloquearZona(zonaId, inicio, fin, fecha, detalle)
}
