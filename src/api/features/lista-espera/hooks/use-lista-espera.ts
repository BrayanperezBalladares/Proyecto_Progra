import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  convertirListaMutationOptions,
  createListaEsperaMutationOptions,
  deleteListaEsperaMutationOptions,
  listaEsperaKeys,
  listaEsperaQueryOptions,
} from '../queries/lista-espera.queries'
import { reservaKeys } from '@api/features/reservas/queries/reservas.queries'

export function useListaEspera() {
  return useQuery(listaEsperaQueryOptions())
}

export function useCreateListaEspera() {
  const qc = useQueryClient()
  return useMutation({
    ...createListaEsperaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: listaEsperaKeys.all }),
  })
}

export function useDeleteListaEspera() {
  const qc = useQueryClient()
  return useMutation({
    ...deleteListaEsperaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: listaEsperaKeys.all }),
  })
}

export function useConvertirListaEspera() {
  const qc = useQueryClient()
  return useMutation({
    ...convertirListaMutationOptions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listaEsperaKeys.all })
      qc.invalidateQueries({ queryKey: reservaKeys.all })
    },
  })
}
