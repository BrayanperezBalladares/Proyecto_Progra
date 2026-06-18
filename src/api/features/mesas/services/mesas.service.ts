import { mockDelay, mockStore } from '@api/mock'
import type { MesaFormPayload } from '@api/types/domain.types'

export async function getMesas() {
  await mockDelay()
  return mockStore.getMesas()
}

export async function getMesasDisponibles(
  inicio: string,
  fin: string,
  capacidad: number,
) {
  await mockDelay()
  return mockStore.getMesasDisponibles(inicio, fin, capacidad)
}

export async function createMesa(payload: MesaFormPayload) {
  await mockDelay()
  return mockStore.createMesa(payload)
}
