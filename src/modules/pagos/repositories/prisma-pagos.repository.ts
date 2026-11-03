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
}