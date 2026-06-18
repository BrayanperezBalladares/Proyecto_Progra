import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  bloquearZonaMutationOptions,
  bloqueoKeys,
  bloqueosQueryOptions,
  createBloqueoMutationOptions,
  deleteBloqueoMutationOptions,
} from '../queries/bloqueos.queries'

export function useBloqueos() {
  return useQuery(bloqueosQueryOptions())
}

export function useCreateBloqueo() {
  const qc = useQueryClient()
  return useMutation({
    ...createBloqueoMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: bloqueoKeys.all }),
  })
}

export function useDeleteBloqueo() {
  const qc = useQueryClient()
  return useMutation({
    ...deleteBloqueoMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: bloqueoKeys.all }),
  })
}

export function useBloquearZona() {
  const qc = useQueryClient()
  return useMutation({
    ...bloquearZonaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: bloqueoKeys.all }),
  })
}
