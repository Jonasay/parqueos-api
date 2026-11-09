import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { ITicketsRepository, RegistrarEntradaData } from './tickets.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Ticket } from '@prisma/client';

@Injectable()
export class PrismaTicketsRepository implements ITicketsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrarEntrada(datos: RegistrarEntradaData): Promise<Ticket> {
    const vehiculo = datos.vehiculoId
      ? await this.prisma.vehiculo.findUnique({ where: { id: datos.vehiculoId } })
      : await this.prisma.vehiculo.findUnique({ where: { placa: datos.placa } });

    if (!vehiculo) {
      throw new NotFoundException('No se encontró el vehículo indicado.');
    }

    const empleadoAutenticado = await this.prisma.empleado.findUnique({
      where: { usuario_id: datos.usuarioId },
    });

    let empleadoId = empleadoAutenticado?.id;
    if (!empleadoId && datos.empleadoId) {
      const empleadoIndicado = await this.prisma.empleado.findUnique({
        where: { id: datos.empleadoId },
      });
      if (!empleadoIndicado) {
        throw new NotFoundException('No se encontró el empleado indicado.');
      }
      empleadoId = empleadoIndicado.id;
    }

    if (!empleadoId) {
      throw new ForbiddenException('El usuario autenticado no está asociado a un empleado.');
    }

    return this.prisma.ticket.create({
      data: {
        vehiculo_id: vehiculo.id,
        espacio_id: datos.espacioId,
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

  async actualizar(codigoTicket: string, datos: any): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { codigo_ticket: codigoTicket },
      data: datos,
    });
  }

  async eliminar(codigoTicket: string): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { codigo_ticket: codigoTicket },
      data: { estado: 'INACTIVO', activo: false },
    });
  }
}