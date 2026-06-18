import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  clienteKeys,
  updateClienteMutationOptions,
} from '../queries/clientes.queries'

export function useUpdateCliente() {
  const qc = useQueryClient()
  return useMutation({
    ...updateClienteMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: clienteKeys.all }),
  })
}
