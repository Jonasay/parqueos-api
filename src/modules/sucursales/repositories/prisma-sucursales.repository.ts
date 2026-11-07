import { Injectable } from '@nestjs/common';
import { ISucursalesRepository } from './sucursales.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Sucursal } from '@prisma/client';

@Injectable()
export class PrismaSucursalesRepository implements ISucursalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Sucursal> {
    return this.prisma.sucursal.create({ data: datos });
  }

  async buscarPorNombre(nombre: string): Promise<Sucursal | null> {
    return this.prisma.sucursal.findFirst({ where: { nombre } });
  }

  async obtenerTodas(): Promise<Sucursal[]> {
    return this.prisma.sucursal.findMany({ include: { niveles_parqueo: true } });
  }

  async buscarPorId(id: number): Promise<Sucursal | null> {
    return this.prisma.sucursal.findUnique({ 
      where: { id },
      include: { niveles_parqueo: true } 
    });
  }

  async eliminar(id: number): Promise<Sucursal> {
    return this.prisma.sucursal.update({ where: { id }, data: { activo: false } });
  }
}