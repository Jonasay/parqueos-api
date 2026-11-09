import type { Ticket } from '@prisma/client';

export const TICKETS_REPOSITORY = 'TICKETS_REPOSITORY';

export type TicketWithRelations = Ticket & {
  vehiculo: { placa: string };
  espacio: { id: number };
};

export interface RegistrarEntradaData {
  vehiculoId?: number;
  placa?: string;
  espacioId: number;
  usuarioId: number;
}

export interface ITicketsRepository {
  registrarEntrada(datos: RegistrarEntradaData): Promise<TicketWithRelations>;
  listar(): Promise<TicketWithRelations[]>;
  buscarPorCodigo(codigoTicket: string): Promise<TicketWithRelations | null>;
  actualizarSalida(id: number, horaSalida: Date): Promise<TicketWithRelations>;
  actualizar(codigoTicket: string, datos: any): Promise<Ticket>;
  eliminar(codigoTicket: string): Promise<Ticket>;
}