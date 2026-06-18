export type MesaEstado = 'libre' | 'reservada' | 'bloqueada'

export type MesaLayout = {
  x: number
  y: number
  shape: 'round' | 'rectangle'
}

export type PlanoMesaReserva = {
  reservaId: number
  clienteNombre: string
  cantidadPersonas: number
  horaInicio: string
  horaFin: string
}

export type PlanoMesaItem = {
  mesaId: number
  capacidad: number
  zonaId: number
  zonaNombre: string
  estado: MesaEstado
  layout: MesaLayout
  reserva?: PlanoMesaReserva
  bloqueoDetalle?: string
}

export type PlanoZona = {
  zonaId: number
  seccion: string
  mesas: PlanoMesaItem[]
}

export type PlanoSalonResumen = {
  total: number
  libres: number
  reservadas: number
  bloqueadas: number
}

export type PlanoSalon = {
  fecha: string
  turnoId: number
  turnoLabel: string
  horaInicio: string
  horaFin: string
  zonas: PlanoZona[]
  resumen: PlanoSalonResumen
}

export type PlanoSalonParams = {
  fecha: string
  turnoId: number
}
