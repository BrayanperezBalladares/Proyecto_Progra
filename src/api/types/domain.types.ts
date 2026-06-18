/** Types aligned with ProyectoIProgra2 API (camelCase for frontend) */

export type Zona = {
  zonaId: number
  seccion: string
}

export type Mesa = {
  mesaId: number
  capacidad: number
  zonaId: number
}

export type Turno = {
  turnoId: number
  horaInicio: number
  horaFin: number
}

export type EstadoDeReserva = {
  estadoDeReservaId: number
  estado: string
}

export type Cliente = {
  clienteId: number
  ced: number
  nombre: string
  apellidos: string
  tel: number
  email: string
}

export type ClienteFormPayload = {
  ced: number
  nombre: string
  apellidos: string
  tel: number
  email: string
}

export type Reserva = {
  reservaId: number
  turnoId: number
  estadoDeReservaId: number
  cantidadPersonas: number
  fecha: string
  horaInicio: string
  horaFin: string
  clienteId: number
  mesaId: number
}

export function toDateOnly(value: string | Date): string {
  if (typeof value === 'string') {
    return value.includes('T') ? value.slice(0, 10) : value
  }
  return value.toISOString().slice(0, 10)
}

export type ReservaFormPayload = {
  clienteId: number
  mesaId: number
  turnoId: number
  cantidadPersonas: number
  fecha: string
  horaInicio: string
  horaFin: string
}

export type ListaDeEspera = {
  listaDeEsperaId: number
  clienteId: number
  turnoId: number
  cantidadPersonas: number
  horaSolicitud: string
}

export type ListaDeEsperaFormPayload = {
  clienteId: number
  turnoId: number
  cantidadPersonas: number
}

export type BloqueoMesa = {
  bloqueoMesaId: number
  mesaId: number
  horaInicio: string
  horaFin: string
  fecha: string
  detalle: string
}

export type BloqueoMesaFormPayload = {
  mesaId: number
  horaInicio: string
  horaFin: string
  fecha: string
  detalle: string
}

export type ZonaFormPayload = {
  seccion: string
}

export type MesaFormPayload = {
  capacidad: number
  zonaId: number
}

export type DashboardStats = {
  reservasActivas: number
  reservasHoy: number
  clientesTotal: number
  enListaEspera: number
  mesasBloqueadas: number
}
