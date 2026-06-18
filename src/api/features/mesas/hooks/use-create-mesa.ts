import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mesaKeys, createMesaMutationOptions } from '../queries/mesas.queries'

export function useCreateMesa() {
  const qc = useQueryClient()
  return useMutation({
    ...createMesaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: mesaKeys.all }),
  })
}
