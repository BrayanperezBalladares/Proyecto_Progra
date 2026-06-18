import { useQuery } from '@tanstack/react-query'
import { getEstados, getTurnos, getZonas } from '@api/features/catalogo/services/catalogo.service'

export const lookupKeys = {
  turnos: ['lookups', 'turnos'] as const,
  estados: ['lookups', 'estados'] as const,
  zonas: ['lookups', 'zonas'] as const,
}

export function useTurnos() {
  return useQuery({ queryKey: lookupKeys.turnos, queryFn: getTurnos, staleTime: Infinity })
}

export function useEstadosReserva() {
  return useQuery({
    queryKey: lookupKeys.estados,
    queryFn: getEstados,
    staleTime: Infinity,
  })
}

export function useZonas() {
  return useQuery({ queryKey: lookupKeys.zonas, queryFn: getZonas, staleTime: Infinity })
}
