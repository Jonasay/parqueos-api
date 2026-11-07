import { Injectable } from '@nestjs/common';
import { INivelesParqueoRepository } from './niveles-parqueo.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { NivelParqueo } from '@prisma/client';

@Injectable()
export class PrismaNivelesParqueoRepository implements INivelesParqueoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<NivelParqueo> {
    return this.prisma.nivelParqueo.create({ data: datos });
  }

  async buscarPorNombreYSucursal(nombreNivel: string, sucursalId: number): Promise<NivelParqueo | null> {
    return this.prisma.nivelParqueo.findFirst({
      where: { nombre_nivel: nombreNivel, sucursal_id: sucursalId },
    });
  }

  async buscarPorId(id: number): Promise<NivelParqueo | null> {
    return this.prisma.nivelParqueo.findUnique({ 
      where: { id },
      include: { espacios_parqueo: true } 
    });
  }

  async obtenerPorSucursal(sucursalId: number): Promise<NivelParqueo[]> {
    return this.prisma.nivelParqueo.findMany({
      where: { sucursal_id: sucursalId },
    });
  }

  async eliminar(id: number): Promise<NivelParqueo> {
    return this.prisma.nivelParqueo.update({ where: { id }, data: { activo: false } });
  }
}