import type { Ticket } from '@prisma/client';

export const TICKETS_REPOSITORY = 'TICKETS_REPOSITORY';

export interface ITicketsRepository {
    registrarEntrada(vehiculoId: number, espacioId: number, empleadoId: number): Promise<Ticket>;
    buscarPorCodigo(codigoTicket: string): Promise<Ticket | null>;
    actualizarSalida(id: number, horaSalida: Date): Promise<Ticket>;
}