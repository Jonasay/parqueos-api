import { Injectable } from '@nestjs/common';
import { IVehiculosRepository } from './vehiculos.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Vehiculo } from '@prisma/client';

@Injectable()
export class PrismaVehiculosRepository implements IVehiculosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Vehiculo> {
    return this.prisma.vehiculo.create({ data: datos });
  }

  async buscarPorPlaca(placa: string): Promise<Vehiculo | null> {
    return this.prisma.vehiculo.findUnique({ where: { placa } });
  }

  async obtenerTodos(): Promise<Vehiculo[]> {
    return this.prisma.vehiculo.findMany();
  }
}