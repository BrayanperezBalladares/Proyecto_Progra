import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  clienteKeys,
  deleteClienteMutationOptions,
} from '../queries/clientes.queries'

export function useDeleteCliente() {
  const qc = useQueryClient()
  return useMutation({
    ...deleteClienteMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: clienteKeys.all }),
  })
}
