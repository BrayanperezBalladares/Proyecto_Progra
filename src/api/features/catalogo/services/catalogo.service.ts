import { isMockApi } from '@api/config'
import { mockDelay, mockStore } from '@api/mock'
import {
  fetchEstadosHttp,
  fetchTurnosHttp,
  fetchZonasHttp,
} from '@api/http/catalogo.http'

export async function getZonas() {
  if (isMockApi()) {
    await mockDelay()
    return mockStore.getZonas()
  }
  return fetchZonasHttp()
}

export async function getTurnos() {
  if (isMockApi()) {
    await mockDelay()
    return mockStore.getTurnos()
  }
  return fetchTurnosHttp()
}

export async function getEstados() {
  if (isMockApi()) {
    await mockDelay()
    return mockStore.getEstados()
  }
  return fetchEstadosHttp()
}
