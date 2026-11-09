import { Injectable } from '@nestjs/common';
import { IPensionesRepository } from './pensiones.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Pension } from '@prisma/client';

@Injectable()
export class PrismaPensionesRepository implements IPensionesRepository {
  constructor(private readonly prisma: PrismaService) { }

  async crear(datos: any): Promise<Pension> {
    return this.prisma.pension.create({ data: datos });
  }

  async buscarActivaPorVehiculo(vehiculoId: number, fechaActual: Date): Promise<Pension | null> {
    return this.prisma.pension.findFirst({
      where: {
        vehiculo_id: vehiculoId,
        estado_pago: 'ACTIVA',
        fecha_inicio: { lte: fechaActual },
        fecha_fin: { gte: fechaActual },
      },
    });
  }

  async obtenerTodas(): Promise<Pension[]> {
    return this.prisma.pension.findMany({
      include: { vehiculo: { include: { cliente: true } } },
    });
  }

  async buscarPorId(id: number): Promise<Pension | null> {
    return this.prisma.pension.findUnique({
      where: { id },
      include: { vehiculo: { include: { cliente: true } } },
    });
  }

  async actualizar(id: number, datos: any): Promise<Pension> {
    return this.prisma.pension.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: number): Promise<Pension> {
    return this.prisma.pension.update({
      where: { id },
      data: { estado_pago: 'INACTIVA', activo: false },
    });
  }
}