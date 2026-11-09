import type { Ticket } from '@prisma/client';

export const TICKETS_REPOSITORY = 'TICKETS_REPOSITORY';

export interface RegistrarEntradaData {
  vehiculoId?: number;
  placa?: string;
  espacioId: number;
  empleadoId?: number;
  usuarioId: number;
}

export interface ITicketsRepository {
    registrarEntrada(datos: RegistrarEntradaData): Promise<Ticket>;
    buscarPorCodigo(codigoTicket: string): Promise<Ticket | null>;
    actualizarSalida(id: number, horaSalida: Date): Promise<Ticket>;
    actualizar(codigoTicket: string, datos: any): Promise<Ticket>;
    eliminar(codigoTicket: string): Promise<Ticket>;
}