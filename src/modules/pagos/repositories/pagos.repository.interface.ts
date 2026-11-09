import { Pago, Ticket } from '@prisma/client';

export const PAGOS_REPOSITORY = 'PAGOS_REPOSITORY';

export interface IPagosRepository {
  registrarPago(datos: any): Promise<Pago>;
  registrarPagoYMarcarTicketComoPagado(datos: any): Promise<Pago>;
  obtenerTicketPorId(ticketId: number): Promise<Ticket | null>;
  marcarTicketComoPagado(ticketId: number): Promise<Ticket>;
  buscarPorId(id: number): Promise<Pago | null>;
  actualizar(id: number, datos: any): Promise<Pago>;
  actualizarPorTicketId(ticketId: number, datos: any): Promise<any>;
  eliminarPorTicketId(ticketId: number): Promise<any>;
}