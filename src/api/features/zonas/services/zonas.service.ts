import { mockDelay, mockStore } from '@api/mock'
import type { ZonaFormPayload } from '@api/types/domain.types'

export async function getZonas() {
  await mockDelay()
  return mockStore.getZonas()
}

export async function createZona(payload: ZonaFormPayload) {
  await mockDelay()
  return mockStore.createZona(payload)
}

export async function updateZona(id: number, payload: ZonaFormPayload) {
  await mockDelay()
  return mockStore.updateZona(id, payload)
}

export async function deleteZona(id: number) {
  await mockDelay()
  mockStore.deleteZona(id)
}
