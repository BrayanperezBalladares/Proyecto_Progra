import { mockDelay, mockStore } from '@api/mock'
import type { ClienteFormPayload } from '@api/types/domain.types'

export async function getClientes() {
  await mockDelay()
  return mockStore.getClientes()
}

export async function getClienteById(id: number) {
  await mockDelay()
  return mockStore.getClienteById(id)
}

export async function getClienteByCedula(ced: number) {
  await mockDelay()
  return mockStore.getClienteByCedula(ced)
}

export async function getReservasByCliente(clienteId: number) {
  await mockDelay()
  return mockStore.getReservasByCliente(clienteId)
}

export async function createCliente(payload: ClienteFormPayload) {
  await mockDelay()
  return mockStore.createCliente(payload)
}

export async function updateCliente(id: number, payload: ClienteFormPayload) {
  await mockDelay()
  return mockStore.updateCliente(id, payload)
}

export async function deleteCliente(id: number) {
  await mockDelay()
  mockStore.deleteCliente(id)
}
