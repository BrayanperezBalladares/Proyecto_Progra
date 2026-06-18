import { MapPin } from 'lucide-react'
import type { PlanoMesaItem, PlanoZona } from '@api/types/plano-mesas.types'
import { MesaFloorPiece } from '../mesa-floor-piece/mesa-floor-piece'

type ZonaFloorMapProps = {
  zona: PlanoZona
  selectedMesaId: number | null
  onSelectMesa: (mesa: PlanoMesaItem) => void
}

export function ZonaFloorMap({
  zona,
  selectedMesaId,
  onSelectMesa,
}: ZonaFloorMapProps) {
  const libres = zona.mesas.filter((m) => m.estado === 'libre').length

  return (
    <section className="restaurant-zone-card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-amber-200/50 bg-gradient-to-r from-amber-50 to-white px-4 py-3">
        <h3 className="flex items-center gap-2 font-display text-lg text-primary">
          <MapPin className="size-4 text-cta" aria-hidden />
          {zona.seccion}
        </h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {libres} libres · {zona.mesas.length} mesas
        </span>
      </div>

      <div className="p-4">
        <div
          className="restaurant-floor relative mx-auto aspect-[4/3] w-full max-w-md rounded-xl"
          role="img"
          aria-label={`Plano de mesas zona ${zona.seccion}`}
        >
          <div
            className="pointer-events-none absolute inset-4 rounded-lg border border-amber-900/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-white/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-amber-900/50"
            aria-hidden
          >
            {zona.seccion}
          </div>
          {zona.mesas.map((mesa) => (
            <MesaFloorPiece
              key={mesa.mesaId}
              mesa={mesa}
              isSelected={selectedMesaId === mesa.mesaId}
              onSelect={onSelectMesa}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
