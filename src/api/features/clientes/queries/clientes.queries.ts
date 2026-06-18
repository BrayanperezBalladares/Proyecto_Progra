import { queryOptions } from '@tanstack/react-query'
import {
  createCliente,
  deleteCliente,
  getClienteById,
  getClientes,
  updateCliente,
} from '../services/clientes.service'
import type { ClienteFormPayload } from '@api/types/domain.types'

export const clienteKeys = {
  all: ['clientes'] as const,
  list: () => [...clienteKeys.all, 'list'] as const,
  detail: (id: number) => [...clienteKeys.all, 'detail', id] as const,
}

export function clientesQueryOptions() {
  return queryOptions({
    queryKey: clienteKeys.list(),
    queryFn: getClientes,
  })
}

export function clienteDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: clienteKeys.detail(id),
    queryFn: () => getClienteById(id),
    enabled: id > 0,
  })
}

export const createClienteMutationOptions = {
  mutationFn: (payload: ClienteFormPayload) => createCliente(payload),
}

export const updateClienteMutationOptions = {
  mutationFn: ({ id, payload }: { id: number; payload: ClienteFormPayload }) =>
    updateCliente(id, payload),
}

export const deleteClienteMutationOptions = {
  mutationFn: (id: number) => deleteCliente(id),
}
