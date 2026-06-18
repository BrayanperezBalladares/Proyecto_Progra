import { queryOptions } from '@tanstack/react-query'
import {
  convertirListaAReserva,
  createListaEspera,
  deleteListaEspera,
  getListaEspera,
} from '../services/lista-espera.service'
import type { ListaDeEsperaFormPayload } from '@api/types/domain.types'

export const listaEsperaKeys = {
  all: ['lista-espera'] as const,
  list: () => [...listaEsperaKeys.all, 'list'] as const,
}

export function listaEsperaQueryOptions() {
  return queryOptions({
    queryKey: listaEsperaKeys.list(),
    queryFn: getListaEspera,
  })
}

export const createListaEsperaMutationOptions = {
  mutationFn: (payload: ListaDeEsperaFormPayload) => createListaEspera(payload),
}

export const deleteListaEsperaMutationOptions = {
  mutationFn: (id: number) => deleteListaEspera(id),
}

export const convertirListaMutationOptions = {
  mutationFn: ({ listaId, mesaId }: { listaId: number; mesaId: number }) =>
    convertirListaAReserva(listaId, mesaId),
}
