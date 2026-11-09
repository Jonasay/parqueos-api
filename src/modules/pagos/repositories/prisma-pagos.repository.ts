import { Injectable } from '@nestjs/common';
import { IPagosRepository } from './pagos.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Pago, Ticket } from '@prisma/client';

@Injectable()
export class PrismaPagosRepository implements IPagosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrarPago(datos: any): Promise<Pago> {
    return this.prisma.pago.create({ data: datos });
  }

  async obtenerTicketPorId(ticketId: number): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id: ticketId } });
  }

  async marcarTicketComoPagado(ticketId: number): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { estado: 'PAGADO' },
    });
  }

  async buscarPorId(id: number): Promise<Pago | null> {
    return this.prisma.pago.findUnique({ where: { id } });
  }

  async actualizar(id: number, datos: any): Promise<Pago> {
    return this.prisma.pago.update({
      where: { id },
      data: datos,
    });
  }

  async actualizarPorTicketId(ticketId: number, datos: any): Promise<any> {
    return this.prisma.pago.updateMany({
      where: { ticket_id: ticketId },
      data: datos,
    });
  }

  async eliminarPorTicketId(ticketId: number): Promise<any> {
    return this.prisma.pago.updateMany({
      where: { ticket_id: ticketId },
      data: { activo: false },
    });
  }
}