import { isMockApi } from '@api/config'
import { mockDelay, mockStore } from '@api/mock'
import {
  cancelarReservaHttp,
  cambiarEstadoReservaHttp,
  createReservaHttp,
  deleteReservaHttp,
  getReservasHttp,
  getMisReservasHttp,
  updateReservaHttp,
} from '@api/http/reservas.http'
import type { ReservaFormPayload } from '@api/types/domain.types'

export async function getReservas() {
  if (!isMockApi()) return getReservasHttp()
  await mockDelay()
  return mockStore.getReservas()
}

export async function createReserva(payload: ReservaFormPayload) {
  if (!isMockApi()) return createReservaHttp(payload)
  await mockDelay()
  return mockStore.createReserva(payload)
}

export async function updateReserva(id: number, payload: ReservaFormPayload) {
  if (!isMockApi()) return updateReservaHttp(id, payload)
  await mockDelay()
  return mockStore.updateReserva(id, payload)
}

export async function cancelarReserva(id: number) {
  if (!isMockApi()) return cancelarReservaHttp(id)
  await mockDelay()
  return mockStore.cancelarReserva(id)
}

export async function cambiarEstadoReserva(id: number, estadoId: number) {
  if (!isMockApi()) return cambiarEstadoReservaHttp(id, estadoId)
  await mockDelay()
  return mockStore.cambiarEstadoReserva(id, estadoId)
}

export async function deleteReserva(id: number) {
  if (!isMockApi()) return deleteReservaHttp(id)
  await mockDelay()
  mockStore.deleteReserva(id)
}

export async function getMisReservas() {
  if (!isMockApi()) return getMisReservasHttp()
  await mockDelay()
  // ponytail: returns first 3 mock reservas for local dev
  return mockStore.getReservas().slice(0, 3)
}
