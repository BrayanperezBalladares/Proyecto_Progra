import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createZonaMutationOptions,
  deleteZonaMutationOptions,
  updateZonaMutationOptions,
  zonaKeys,
  zonasQueryOptions,
} from '../queries/zonas.queries'

export function useZonas() {
  return useQuery(zonasQueryOptions())
}

export function useCreateZona() {
  const qc = useQueryClient()
  return useMutation({
    ...createZonaMutationOptions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: zonaKeys.all })
      qc.invalidateQueries({ queryKey: ['lookups', 'zonas'] })
    },
  })
}

export function useUpdateZona() {
  const qc = useQueryClient()
  return useMutation({
    ...updateZonaMutationOptions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: zonaKeys.all })
      qc.invalidateQueries({ queryKey: ['lookups', 'zonas'] })
    },
  })
}

export function useDeleteZona() {
  const qc = useQueryClient()
  return useMutation({
    ...deleteZonaMutationOptions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: zonaKeys.all })
      qc.invalidateQueries({ queryKey: ['lookups', 'zonas'] })
    },
  })
}
