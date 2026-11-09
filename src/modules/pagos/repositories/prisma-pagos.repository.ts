import { Injectable } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { IPagosRepository } from './pagos.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Pago, Ticket } from '@prisma/client';

@Injectable()
export class PrismaPagosRepository implements IPagosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrarPago(datos: any): Promise<Pago> {
    return this.prisma.pago.create({ data: datos });
  }

  async registrarPagoYMarcarTicketComoPagado(datos: any): Promise<Pago> {
    return this.prisma.$transaction(async (transaction) => {
      const updated = await transaction.ticket.updateMany({
        where: { id: datos.ticket_id, estado: 'FINALIZADO' },
        data: { estado: 'PAGADO' },
      });
      if (updated.count !== 1) {
        const ticket = await transaction.ticket.findUnique({
          where: { id: datos.ticket_id },
        });
        if (ticket?.estado === 'PAGADO') {
          throw new UnprocessableEntityException('El ticket ya se encuentra pagado.');
        }
        throw new UnprocessableEntityException(
          'El ticket debe tener una salida registrada antes de procesar el pago.',
        );
      }

      return transaction.pago.create({ data: datos });
    });
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