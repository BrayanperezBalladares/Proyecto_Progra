import type {
  BloqueoMesa,
  Cliente,
  EstadoDeReserva,
  ListaDeEspera,
  Mesa,
  Reserva,
  Turno,
  Zona,
} from '@api/types/domain.types'

export const seedZonas: Zona[] = [
  { zonaId: 1, seccion: 'Interior' },
  { zonaId: 2, seccion: 'Terraza' },
  { zonaId: 3, seccion: 'Jardín' },
  { zonaId: 4, seccion: 'VIP' },
]

export const seedMesas: Mesa[] = [
  { mesaId: 1, capacidad: 4, zonaId: 1 },
  { mesaId: 2, capacidad: 2, zonaId: 1 },
  { mesaId: 3, capacidad: 6, zonaId: 1 },
  { mesaId: 4, capacidad: 4, zonaId: 2 },
  { mesaId: 5, capacidad: 2, zonaId: 2 },
  { mesaId: 6, capacidad: 8, zonaId: 2 },
  { mesaId: 7, capacidad: 4, zonaId: 3 },
  { mesaId: 8, capacidad: 6, zonaId: 3 },
  { mesaId: 9, capacidad: 4, zonaId: 4 },
  { mesaId: 10, capacidad: 8, zonaId: 4 },
]

export const seedTurnos: Turno[] = [
  { turnoId: 1, horaInicio: 8, horaFin: 11 },
  { turnoId: 2, horaInicio: 12, horaFin: 17 },
  { turnoId: 3, horaInicio: 18, horaFin: 22 },
]

export const seedEstados: EstadoDeReserva[] = [
  { estadoDeReservaId: 1, estado: 'Activa' },
  { estadoDeReservaId: 2, estado: 'Cancelada' },
  { estadoDeReservaId: 3, estado: 'Atendida' },
]

export const seedClientes: Cliente[] = [
  { clienteId: 1, ced: 101110111, nombre: 'Juan', apellidos: 'Pérez López', tel: 88881111, email: 'juan@email.com' },
  { clienteId: 2, ced: 202220222, nombre: 'María', apellidos: 'González Mora', tel: 88882222, email: 'maria@email.com' },
  { clienteId: 3, ced: 303330333, nombre: 'Carlos', apellidos: 'Rodríguez Soto', tel: 88883333, email: 'carlos@email.com' },
  { clienteId: 4, ced: 404440444, nombre: 'Ana', apellidos: 'Martínez Cruz', tel: 88884444, email: 'ana@email.com' },
  { clienteId: 5, ced: 505550555, nombre: 'Luis', apellidos: 'Hernández Vega', tel: 88885555, email: 'luis@email.com' },
  { clienteId: 6, ced: 606660666, nombre: 'Sofía', apellidos: 'Ramírez Quirós', tel: 88886666, email: 'sofia@email.com' },
  { clienteId: 7, ced: 707770777, nombre: 'Diego', apellidos: 'Vargas Jiménez', tel: 88887777, email: 'diego@email.com' },
  { clienteId: 8, ced: 808880888, nombre: 'Valeria', apellidos: 'Castro Solano', tel: 88888888, email: 'valeria@email.com' },
  { clienteId: 9, ced: 909990999, nombre: 'Andrés', apellidos: 'Mora Brenes', tel: 88889999, email: 'andres@email.com' },
  { clienteId: 10, ced: 101010101, nombre: 'Camila', apellidos: 'Rojas Campos', tel: 88880000, email: 'camila@email.com' },
  { clienteId: 11, ced: 111111110, nombre: 'Sebastián', apellidos: 'Núñez Alfaro', tel: 87771111, email: 'sebastian@email.com' },
  { clienteId: 12, ced: 121212120, nombre: 'Isabella', apellidos: 'Flores Madrigal', tel: 87772222, email: 'isabella@email.com' },
  { clienteId: 13, ced: 131313130, nombre: 'Mateo', apellidos: 'Chaves Araya', tel: 87773333, email: 'mateo@email.com' },
  { clienteId: 14, ced: 141414140, nombre: 'Daniela', apellidos: 'Segura Monge', tel: 87774444, email: 'daniela@email.com' },
  { clienteId: 15, ced: 151515150, nombre: 'Gabriel', apellidos: 'Herrera Vindas', tel: 87775555, email: 'gabriel@email.com' },
]

export const seedReservas: Reserva[] = [
  { reservaId: 1, clienteId: 1, mesaId: 1, turnoId: 2, estadoDeReservaId: 1, cantidadPersonas: 3, fecha: '2026-06-15', horaInicio: '2026-06-15T12:00:00', horaFin: '2026-06-15T15:00:00' },
  { reservaId: 2, clienteId: 2, mesaId: 4, turnoId: 3, estadoDeReservaId: 1, cantidadPersonas: 2, fecha: '2026-06-15', horaInicio: '2026-06-15T18:00:00', horaFin: '2026-06-15T22:00:00' },
  { reservaId: 3, clienteId: 3, mesaId: 7, turnoId: 1, estadoDeReservaId: 1, cantidadPersonas: 4, fecha: '2026-06-16', horaInicio: '2026-06-16T08:00:00', horaFin: '2026-06-16T11:00:00' },
  { reservaId: 4, clienteId: 4, mesaId: 3, turnoId: 2, estadoDeReservaId: 1, cantidadPersonas: 5, fecha: '2026-06-16', horaInicio: '2026-06-16T12:00:00', horaFin: '2026-06-16T15:00:00' },
  { reservaId: 5, clienteId: 5, mesaId: 5, turnoId: 3, estadoDeReservaId: 1, cantidadPersonas: 2, fecha: '2026-06-16', horaInicio: '2026-06-16T18:00:00', horaFin: '2026-06-16T22:00:00' },
  { reservaId: 6, clienteId: 6, mesaId: 8, turnoId: 1, estadoDeReservaId: 1, cantidadPersonas: 6, fecha: '2026-06-17', horaInicio: '2026-06-17T08:00:00', horaFin: '2026-06-17T11:00:00' },
  { reservaId: 7, clienteId: 7, mesaId: 9, turnoId: 2, estadoDeReservaId: 1, cantidadPersonas: 4, fecha: '2026-06-17', horaInicio: '2026-06-17T12:00:00', horaFin: '2026-06-17T15:00:00' },
  { reservaId: 8, clienteId: 8, mesaId: 6, turnoId: 1, estadoDeReservaId: 1, cantidadPersonas: 7, fecha: '2026-06-17', horaInicio: '2026-06-17T08:00:00', horaFin: '2026-06-17T11:00:00' },
  { reservaId: 9, clienteId: 9, mesaId: 10, turnoId: 2, estadoDeReservaId: 1, cantidadPersonas: 4, fecha: '2026-06-18', horaInicio: '2026-06-18T12:00:00', horaFin: '2026-06-18T15:00:00' },
  { reservaId: 10, clienteId: 10, mesaId: 2, turnoId: 3, estadoDeReservaId: 2, cantidadPersonas: 2, fecha: '2026-06-18', horaInicio: '2026-06-18T18:00:00', horaFin: '2026-06-18T22:00:00' },
  { reservaId: 11, clienteId: 11, mesaId: 1, turnoId: 1, estadoDeReservaId: 1, cantidadPersonas: 3, fecha: '2026-06-18', horaInicio: '2026-06-18T08:00:00', horaFin: '2026-06-18T11:00:00' },
  { reservaId: 12, clienteId: 12, mesaId: 4, turnoId: 2, estadoDeReservaId: 1, cantidadPersonas: 4, fecha: '2026-06-19', horaInicio: '2026-06-19T12:00:00', horaFin: '2026-06-19T15:00:00' },
  { reservaId: 13, clienteId: 13, mesaId: 7, turnoId: 3, estadoDeReservaId: 3, cantidadPersonas: 3, fecha: '2026-06-19', horaInicio: '2026-06-19T18:00:00', horaFin: '2026-06-19T22:00:00' },
  { reservaId: 14, clienteId: 14, mesaId: 3, turnoId: 1, estadoDeReservaId: 1, cantidadPersonas: 6, fecha: '2026-06-20', horaInicio: '2026-06-20T08:00:00', horaFin: '2026-06-20T11:00:00' },
  { reservaId: 15, clienteId: 15, mesaId: 5, turnoId: 2, estadoDeReservaId: 1, cantidadPersonas: 2, fecha: '2026-06-20', horaInicio: '2026-06-20T12:00:00', horaFin: '2026-06-20T15:00:00' },
  { reservaId: 16, clienteId: 15, mesaId: 9, turnoId: 3, estadoDeReservaId: 1, cantidadPersonas: 4, fecha: '2026-06-20', horaInicio: '2026-06-20T18:00:00', horaFin: '2026-06-20T22:00:00' },
]

export const seedListaEspera: ListaDeEspera[] = [
  { listaDeEsperaId: 1, clienteId: 3, turnoId: 2, cantidadPersonas: 4, horaSolicitud: '2026-06-15T11:30:00' },
  { listaDeEsperaId: 2, clienteId: 4, turnoId: 3, cantidadPersonas: 2, horaSolicitud: '2026-06-15T17:00:00' },
  { listaDeEsperaId: 3, clienteId: 6, turnoId: 1, cantidadPersonas: 3, horaSolicitud: '2026-06-16T07:45:00' },
  { listaDeEsperaId: 4, clienteId: 9, turnoId: 2, cantidadPersonas: 5, horaSolicitud: '2026-06-17T11:00:00' },
  { listaDeEsperaId: 5, clienteId: 12, turnoId: 3, cantidadPersonas: 2, horaSolicitud: '2026-06-18T17:30:00' },
]

export const seedBloqueos: BloqueoMesa[] = [
  { bloqueoMesaId: 1, mesaId: 2, fecha: '2026-06-15', horaInicio: '2026-06-15T08:00:00', horaFin: '2026-06-15T22:00:00', detalle: 'Mantenimiento de mesa' },
  { bloqueoMesaId: 2, mesaId: 6, fecha: '2026-06-16', horaInicio: '2026-06-16T18:00:00', horaFin: '2026-06-16T22:00:00', detalle: 'Evento privado' },
  { bloqueoMesaId: 3, mesaId: 10, fecha: '2026-06-15', horaInicio: '2026-06-15T08:00:00', horaFin: '2026-06-15T11:00:00', detalle: 'Limpieza profunda' },
  { bloqueoMesaId: 4, mesaId: 3, fecha: '2026-06-18', horaInicio: '2026-06-18T12:00:00', horaFin: '2026-06-18T15:00:00', detalle: 'Reserva especial' },
  { bloqueoMesaId: 5, mesaId: 9, fecha: '2026-06-19', horaInicio: '2026-06-19T08:00:00', horaFin: '2026-06-19T11:00:00', detalle: 'Inspección de zona VIP' },
]
