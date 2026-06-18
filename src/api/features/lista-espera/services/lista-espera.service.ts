import { mockDelay, mockStore } from '@api/mock'
import type { ListaDeEsperaFormPayload } from '@api/types/domain.types'

export async function getListaEspera() {
  await mockDelay()
  return mockStore.getListaEspera()
}

export async function createListaEspera(payload: ListaDeEsperaFormPayload) {
  await mockDelay()
  return mockStore.createListaEspera(payload)
}

export async function deleteListaEspera(id: number) {
  await mockDelay()
  mockStore.deleteListaEspera(id)
}

export async function convertirListaAReserva(listaId: number, mesaId: number) {
  await mockDelay()
  return mockStore.convertirListaAReserva(listaId, mesaId)
}
