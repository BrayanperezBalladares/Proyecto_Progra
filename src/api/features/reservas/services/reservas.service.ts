import { mockDelay, mockStore } from '@api/mock'
import type { ReservaFormPayload } from '@api/types/domain.types'

export async function getReservas() {
  await mockDelay()
  return mockStore.getReservas()
}

export async function createReserva(payload: ReservaFormPayload) {
  await mockDelay()
  return mockStore.createReserva(payload)
}

export async function updateReserva(id: number, payload: ReservaFormPayload) {
  await mockDelay()
  return mockStore.updateReserva(id, payload)
}

export async function cancelarReserva(id: number) {
  await mockDelay()
  return mockStore.cancelarReserva(id)
}

export async function cambiarEstadoReserva(id: number, estadoId: number) {
  await mockDelay()
  return mockStore.cambiarEstadoReserva(id, estadoId)
}

export async function deleteReserva(id: number) {
  await mockDelay()
  mockStore.deleteReserva(id)
}
