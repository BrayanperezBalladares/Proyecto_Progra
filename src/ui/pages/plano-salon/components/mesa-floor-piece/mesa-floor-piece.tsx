import { Users } from 'lucide-react'
import type { MesaEstado, PlanoMesaItem } from '@api/types/plano-mesas.types'

const estadoStyles: Record<
  MesaEstado,
  { fill: string; ring: string; top: string; label: string }
> = {
  libre: {
    fill: 'bg-emerald-600',
    ring: 'ring-emerald-700/50 hover:ring-emerald-700',
    top: 'bg-emerald-800/90',
    label: 'Libre',
  },
  reservada: {
    fill: 'bg-primary',
    ring: 'ring-primary/50 hover:ring-primary',
    top: 'bg-primary-dark/90',
    label: 'Reservada',
  },
  bloqueada: {
    fill: 'bg-cta',
    ring: 'ring-amber-700/50 hover:ring-amber-700',
    top: 'bg-amber-900/90',
    label: 'Bloqueada',
  },
}

type MesaFloorPieceProps = {
  mesa: PlanoMesaItem
  isSelected: boolean
  onSelect: (mesa: PlanoMesaItem) => void
}

export function MesaFloorPiece({ mesa, isSelected, onSelect }: MesaFloorPieceProps) {
  const style = estadoStyles[mesa.estado]
  const isLarge = mesa.capacidad >= 6
  const sizeClass = isLarge
    ? 'h-[4.5rem] w-[5.5rem]'
    : mesa.capacidad <= 2
      ? 'h-12 w-12'
      : 'h-14 w-[3.25rem]'

  const round = mesa.layout.shape === 'round'

  return (
    <button
      type="button"
      aria-label={`Mesa ${mesa.mesaId}, ${style.label}, ${mesa.capacidad} personas`}
      title={`Mesa ${mesa.mesaId} — ${style.label}`}
      onClick={() => onSelect(mesa)}
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-stretch overflow-hidden shadow-lg ring-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta ${style.ring} ${sizeClass} ${round ? 'rounded-full' : 'rounded-md'} ${isSelected ? 'z-10 scale-110 ring-4 ring-amber-400' : 'z-0 hover:scale-105'}`}
      style={{ left: `${mesa.layout.x}%`, top: `${mesa.layout.y}%` }}
    >
      <span
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-white ${style.fill}`}
      >
        <span className="text-[10px] font-bold tracking-wide">M{mesa.mesaId}</span>
        <span className="flex items-center gap-0.5 text-[9px] opacity-95">
          <Users className="size-2.5" aria-hidden />
          {mesa.capacidad}
        </span>
      </span>
      <span
        className={`h-1.5 shrink-0 ${style.top}`}
        aria-hidden
      />
    </button>
  )
}
