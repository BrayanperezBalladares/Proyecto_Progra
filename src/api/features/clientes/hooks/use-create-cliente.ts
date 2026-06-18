import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  clienteKeys,
  createClienteMutationOptions,
} from '../queries/clientes.queries'

export function useCreateCliente() {
  const qc = useQueryClient()
  return useMutation({
    ...createClienteMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: clienteKeys.list() }),
  })
}
