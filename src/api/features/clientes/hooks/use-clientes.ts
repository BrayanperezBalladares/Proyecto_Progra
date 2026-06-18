import { useQuery } from '@tanstack/react-query'
import { clientesQueryOptions } from '../queries/clientes.queries'

export function useClientes() {
  return useQuery(clientesQueryOptions())
}
