import { Pago, Ticket } from '@prisma/client';

export const PAGOS_REPOSITORY = 'PAGOS_REPOSITORY';

export interface IPagosRepository {
  registrarPago(datos: any): Promise<Pago>;
  obtenerTicketPorId(ticketId: number): Promise<Ticket | null>;
  marcarTicketComoPagado(ticketId: number): Promise<Ticket>;
}