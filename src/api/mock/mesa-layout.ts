import type { MesaLayout } from '@api/types/plano-mesas.types'

/** Fixed floor positions (%) — mimics a real dining room layout per zone */
export const mesaLayoutById: Record<number, MesaLayout> = {
  1: { x: 50, y: 18, shape: 'round' },
  2: { x: 18, y: 55, shape: 'round' },
  3: { x: 78, y: 50, shape: 'rectangle' },
  4: { x: 25, y: 25, shape: 'round' },
  5: { x: 55, y: 60, shape: 'round' },
  6: { x: 75, y: 22, shape: 'rectangle' },
  7: { x: 30, y: 35, shape: 'round' },
  8: { x: 68, y: 55, shape: 'rectangle' },
  9: { x: 35, y: 30, shape: 'round' },
  10: { x: 65, y: 45, shape: 'rectangle' },
}

export function getDefaultLayout(mesaId: number): MesaLayout {
  return (
    mesaLayoutById[mesaId] ?? {
      x: 50,
      y: 50,
      shape: 'round' as const,
    }
  )
}
