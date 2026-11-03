import { Injectable } from '@nestjs/common';
import type { ITicketsRepository } from './tickets.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Ticket } from '@prisma/client';

@Injectable()
export class PrismaTicketsRepository implements ITicketsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrarEntrada(vehiculoId: number, espacioId: number, empleadoId: number): Promise<Ticket> {
    return this.prisma.ticket.create({
      data: {
        vehiculo_id: vehiculoId,
        espacio_id: espacioId,
        empleado_ingreso_id: empleadoId,
        hora_entrada: new Date(),
        estado: 'ACTIVO',
      },
    });
  }

  async buscarPorCodigo(codigoTicket: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({
      where: { codigo_ticket: codigoTicket },
      include: { espacio: true, vehiculo: true },
    });
  }

  async actualizarSalida(id: number, horaSalida: Date): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { id },
      data: { hora_salida: horaSalida, estado: 'FINALIZADO' },
    });
  }
}