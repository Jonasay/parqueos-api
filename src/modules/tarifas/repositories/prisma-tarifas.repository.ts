import { Injectable } from '@nestjs/common';
import { ITarifasRepository } from './tarifas.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Tarifa } from '@prisma/client';

@Injectable()
export class PrismaTarifasRepository implements ITarifasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Tarifa> {
    return this.prisma.tarifa.create({ data: datos });
  }

  async buscarPorTipoVehiculo(tipoVehiculoId: number): Promise<Tarifa | null> {
    return this.prisma.tarifa.findFirst({
      where: { tipo_vehiculo_id: tipoVehiculoId, estado_activo: true },
    });
  }

  async buscarPorId(id: number): Promise<Tarifa | null> {
    return this.prisma.tarifa.findUnique({
      where: { id },
      include: { tipo_vehiculo: true },
    });
  }

  async obtenerTodas(): Promise<Tarifa[]> {
    return this.prisma.tarifa.findMany({ include: { tipo_vehiculo: true } });
  }

  async actualizar(id: number, datos: any): Promise<Tarifa> {
    return this.prisma.tarifa.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: number): Promise<Tarifa> {
    return this.prisma.tarifa.update({
      where: { id },
      data: { estado_activo: false },
    });
  }
}