import type {
  BloqueoMesa,
  BloqueoMesaFormPayload,
  Cliente,
  ClienteFormPayload,
  DashboardStats,
  ListaDeEspera,
  ListaDeEsperaFormPayload,
  Mesa,
  MesaFormPayload,
  Reserva,
  ReservaFormPayload,
  Zona,
  ZonaFormPayload,
} from '@api/types/domain.types'
import {
  seedBloqueos,
  seedClientes,
  seedEstados,
  seedListaEspera,
  seedMesas,
  seedReservas,
  seedTurnos,
  seedZonas,
} from './seed'
import { buildPlanoSalon } from '@api/shared/plano/build-plano-salon'
import type { PlanoSalon } from '@api/types/plano-mesas.types'

type MockDb = {
  zonas: Zona[]
  mesas: Mesa[]
  turnos: typeof seedTurnos
  estados: typeof seedEstados
  clientes: Cliente[]
  reservas: Reserva[]
  listaEspera: ListaDeEspera[]
  bloqueos: BloqueoMesa[]
  nextIds: {
    cliente: number
    reserva: number
    mesa: number
    zona: number
    listaEspera: number
    bloqueo: number
  }
}

function cloneDb(): MockDb {
  return {
    zonas: structuredClone(seedZonas),
    mesas: structuredClone(seedMesas),
    turnos: structuredClone(seedTurnos),
    estados: structuredClone(seedEstados),
    clientes: structuredClone(seedClientes),
    reservas: structuredClone(seedReservas),
    listaEspera: structuredClone(seedListaEspera),
    bloqueos: structuredClone(seedBloqueos),
    nextIds: {
      cliente: 16,
      reserva: 17,
      mesa: 11,
      zona: 5,
      listaEspera: 6,
      bloqueo: 6,
    },
  }
}

let db = cloneDb()

export function resetMockDb(): void {
  db = cloneDb()
}

function parseDate(iso: string): number {
  return new Date(iso).getTime()
}

function rangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return parseDate(startA) < parseDate(endB) && parseDate(endA) > parseDate(startB)
}

function isMesaBlocked(mesaId: number, inicio: string, fin: string): boolean {
  return db.bloqueos.some(
    (b) =>
      b.mesaId === mesaId &&
      rangesOverlap(inicio, fin, b.horaInicio, b.horaFin),
  )
}

function isMesaReserved(
  mesaId: number,
  inicio: string,
  fin: string,
  excludeReservaId?: number,
): boolean {
  return db.reservas.some(
    (r) =>
      r.mesaId === mesaId &&
      r.estadoDeReservaId === 1 &&
      r.reservaId !== excludeReservaId &&
      rangesOverlap(inicio, fin, r.horaInicio, r.horaFin),
  )
}

function assertMesaAvailable(
  mesaId: number,
  inicio: string,
  fin: string,
  excludeReservaId?: number,
): void {
  const mesa = db.mesas.find((m) => m.mesaId === mesaId)
  if (!mesa) throw new Error('Mesa no encontrada')
  if (isMesaBlocked(mesaId, inicio, fin)) {
    throw new Error('La mesa está bloqueada en ese horario')
  }
  if (isMesaReserved(mesaId, inicio, fin, excludeReservaId)) {
    throw new Error('La mesa no está disponible en el horario indicado')
  }
}

// --- Catalog ---

export const mockStore = {
  getZonas: () => [...db.zonas],
  getZonaById: (id: number) => {
    const z = db.zonas.find((x) => x.zonaId === id)
    if (!z) throw new Error('Zona no encontrada')
    return z
  },
  getMesasDeZona: (zonaId: number) =>
    db.mesas.filter((m) => m.zonaId === zonaId),
  createZona: (payload: ZonaFormPayload) => {
    const zona: Zona = { zonaId: db.nextIds.zona++, ...payload }
    db.zonas.push(zona)
    return zona
  },
  updateZona: (id: number, payload: ZonaFormPayload) => {
    const z = db.zonas.find((x) => x.zonaId === id)
    if (!z) throw new Error('Zona no encontrada')
    z.seccion = payload.seccion
    return z
  },
  deleteZona: (id: number) => {
    if (db.mesas.some((m) => m.zonaId === id)) {
      throw new Error('No se puede eliminar una zona con mesas asignadas')
    }
    db.zonas = db.zonas.filter((z) => z.zonaId !== id)
  },

  getMesas: () => [...db.mesas],
  getMesaById: (id: number) => {
    const m = db.mesas.find((x) => x.mesaId === id)
    if (!m) throw new Error('Mesa no encontrada')
    return m
  },
  getMesasDisponibles: (inicio: string, fin: string, capacidad: number) =>
    db.mesas.filter(
      (m) =>
        m.capacidad >= capacidad &&
        !isMesaBlocked(m.mesaId, inicio, fin) &&
        !isMesaReserved(m.mesaId, inicio, fin),
    ),
  createMesa: (payload: MesaFormPayload) => {
    mockStore.getZonaById(payload.zonaId)
    const mesa: Mesa = { mesaId: db.nextIds.mesa++, ...payload }
    db.mesas.push(mesa)
    return mesa
  },

  getTurnos: () => [...db.turnos],
  getEstados: () => [...db.estados],

  // --- Clientes ---

  getClientes: () => [...db.clientes],
  getClienteById: (id: number) => {
    const c = db.clientes.find((x) => x.clienteId === id)
    if (!c) throw new Error('Cliente no encontrado')
    return c
  },
  getClienteByCedula: (ced: number) => {
    const c = db.clientes.find((x) => x.ced === ced)
    if (!c) throw new Error('Cliente no encontrado')
    return c
  },
  getReservasByCliente: (clienteId: number) =>
    db.reservas.filter((r) => r.clienteId === clienteId),
  createCliente: (payload: ClienteFormPayload) => {
    if (db.clientes.some((c) => c.ced === payload.ced)) {
      throw new Error('Ya existe un cliente con esa cédula')
    }
    const cliente: Cliente = { clienteId: db.nextIds.cliente++, ...payload }
    db.clientes.push(cliente)
    return cliente
  },
  updateCliente: (id: number, payload: ClienteFormPayload) => {
    const c = db.clientes.find((x) => x.clienteId === id)
    if (!c) throw new Error('Cliente no encontrado')
    if (db.clientes.some((x) => x.ced === payload.ced && x.clienteId !== id)) {
      throw new Error('Ya existe un cliente con esa cédula')
    }
    Object.assign(c, payload)
    return c
  },
  deleteCliente: (id: number) => {
    if (db.reservas.some((r) => r.clienteId === id && r.estadoDeReservaId === 1)) {
      throw new Error('No se puede eliminar un cliente con reservas activas')
    }
    db.clientes = db.clientes.filter((c) => c.clienteId !== id)
    db.listaEspera = db.listaEspera.filter((l) => l.clienteId !== id)
  },

  // --- Reservas ---

  getReservas: () => [...db.reservas],
  getReservaById: (id: number) => {
    const r = db.reservas.find((x) => x.reservaId === id)
    if (!r) throw new Error('Reserva no encontrada')
    return r
  },
  getReservasByEstado: (estadoId: number) =>
    db.reservas.filter((r) => r.estadoDeReservaId === estadoId),
  getReservasByFecha: (fecha: string) =>
    db.reservas.filter((r) => r.fecha === fecha),
  createReserva: (payload: ReservaFormPayload) => {
    mockStore.getClienteById(payload.clienteId)
    const mesa = mockStore.getMesaById(payload.mesaId)
    if (mesa.capacidad < payload.cantidadPersonas) {
      throw new Error('La mesa no tiene capacidad suficiente')
    }
    assertMesaAvailable(payload.mesaId, payload.horaInicio, payload.horaFin)
    const reserva: Reserva = {
      reservaId: db.nextIds.reserva++,
      estadoDeReservaId: 1,
      ...payload,
    }
    db.reservas.push(reserva)
    return reserva
  },
  updateReserva: (id: number, payload: ReservaFormPayload) => {
    const r = db.reservas.find((x) => x.reservaId === id)
    if (!r) throw new Error('Reserva no encontrada')
    if (r.estadoDeReservaId !== 1) {
      throw new Error('Solo se pueden modificar reservas activas')
    }
    assertMesaAvailable(payload.mesaId, payload.horaInicio, payload.horaFin, id)
    Object.assign(r, payload)
    return r
  },
  cancelarReserva: (id: number) => {
    const r = mockStore.getReservaById(id)
    r.estadoDeReservaId = 2
    return r
  },
  cambiarEstadoReserva: (id: number, estadoId: number) => {
    const r = mockStore.getReservaById(id)
    if (!db.estados.some((e) => e.estadoDeReservaId === estadoId)) {
      throw new Error('Estado de reserva inválido')
    }
    r.estadoDeReservaId = estadoId
    return r
  },
  asignarMesa: (reservaId: number, mesaId: number) => {
    const r = mockStore.getReservaById(reservaId)
    assertMesaAvailable(mesaId, r.horaInicio, r.horaFin, reservaId)
    r.mesaId = mesaId
    return r
  },
  deleteReserva: (id: number) => {
    db.reservas = db.reservas.filter((r) => r.reservaId !== id)
  },

  // --- Lista de espera ---

  getListaEspera: () => [...db.listaEspera],
  getListaEsperaById: (id: number) => {
    const l = db.listaEspera.find((x) => x.listaDeEsperaId === id)
    if (!l) throw new Error('Entrada de lista de espera no encontrada')
    return l
  },
  getListaPorTurno: (turnoId: number) =>
    db.listaEspera
      .filter((l) => l.turnoId === turnoId)
      .sort(
        (a, b) =>
          parseDate(a.horaSolicitud) - parseDate(b.horaSolicitud),
      ),
  createListaEspera: (payload: ListaDeEsperaFormPayload) => {
    mockStore.getClienteById(payload.clienteId)
    const entry: ListaDeEspera = {
      listaDeEsperaId: db.nextIds.listaEspera++,
      horaSolicitud: new Date().toISOString(),
      ...payload,
    }
    db.listaEspera.push(entry)
    return entry
  },
  deleteListaEspera: (id: number) => {
    db.listaEspera = db.listaEspera.filter((l) => l.listaDeEsperaId !== id)
  },
  convertirListaAReserva: (listaId: number, mesaId: number) => {
    const entry = mockStore.getListaEsperaById(listaId)
    const turno = db.turnos.find((t) => t.turnoId === entry.turnoId)!
    const fecha = new Date().toISOString().slice(0, 10)
    const horaInicio = `${fecha}T${String(turno.horaInicio).padStart(2, '0')}:00:00`
    const horaFin = `${fecha}T${String(turno.horaFin).padStart(2, '0')}:00:00`
    const reserva = mockStore.createReserva({
      clienteId: entry.clienteId,
      mesaId,
      turnoId: entry.turnoId,
      cantidadPersonas: entry.cantidadPersonas,
      fecha,
      horaInicio,
      horaFin,
    })
    mockStore.deleteListaEspera(listaId)
    return reserva
  },

  // --- Bloqueos ---

  getBloqueos: () => [...db.bloqueos],
  getBloqueosPorMesa: (mesaId: number) =>
    db.bloqueos.filter((b) => b.mesaId === mesaId),
  createBloqueo: (payload: BloqueoMesaFormPayload) => {
    mockStore.getMesaById(payload.mesaId)
    const bloqueo: BloqueoMesa = {
      bloqueoMesaId: db.nextIds.bloqueo++,
      ...payload,
    }
    db.bloqueos.push(bloqueo)
    return bloqueo
  },
  deleteBloqueo: (id: number) => {
    db.bloqueos = db.bloqueos.filter((b) => b.bloqueoMesaId !== id)
  },
  bloquearZona: (
    zonaId: number,
    inicio: string,
    fin: string,
    fecha: string,
    detalle: string,
  ) => {
    const mesas = mockStore.getMesasDeZona(zonaId)
    return mesas.map((m) =>
      mockStore.createBloqueo({
        mesaId: m.mesaId,
        horaInicio: inicio,
        horaFin: fin,
        fecha,
        detalle,
      }),
    )
  },

  // --- Plano del salón (table status by date + shift) ---

  getPlanoSalon: (fecha: string, turnoId: number): PlanoSalon =>
    buildPlanoSalon(
      { fecha, turnoId },
      {
        zonas: db.zonas,
        mesas: db.mesas,
        turnos: db.turnos,
        reservas: db.reservas,
        bloqueos: db.bloqueos,
        clientes: db.clientes,
      },
    ),

  // --- Dashboard ---

  getDashboardStats: (): DashboardStats => {
    const hoy = new Date().toISOString().slice(0, 10)
    return {
      reservasActivas: db.reservas.filter((r) => r.estadoDeReservaId === 1)
        .length,
      reservasHoy: db.reservas.filter((r) => r.fecha === hoy).length,
      clientesTotal: db.clientes.length,
      enListaEspera: db.listaEspera.length,
      mesasBloqueadas: new Set(db.bloqueos.map((b) => b.mesaId)).size,
    }
  },
}
