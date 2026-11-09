import { Injectable } from '@nestjs/common';
import { ITiposVehiculoRepository } from './tipos-vehiculo.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { TipoVehiculo } from '@prisma/client';

@Injectable()
export class PrismaTiposVehiculoRepository implements ITiposVehiculoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<TipoVehiculo> {
    return this.prisma.tipoVehiculo.create({ data: datos });
  }

  async buscarPorNombre(nombre: string): Promise<TipoVehiculo | null> {
    return this.prisma.tipoVehiculo.findFirst({ where: { nombre } });
  }

  async buscarPorId(id: number): Promise<TipoVehiculo | null> {
    return this.prisma.tipoVehiculo.findUnique({ where: { id } });
  }

  async obtenerTodos(): Promise<TipoVehiculo[]> {
    return this.prisma.tipoVehiculo.findMany();
  }

  async actualizar(id: number, datos: any): Promise<TipoVehiculo> {
    return this.prisma.tipoVehiculo.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: number): Promise<TipoVehiculo> {
    return this.prisma.tipoVehiculo.update({ where: { id }, data: { activo: false } });
  }
}