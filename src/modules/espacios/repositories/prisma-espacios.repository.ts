import { Injectable } from '@nestjs/common';
import { IEspaciosRepository } from './espacios.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { EspacioParqueo } from '@prisma/client';

@Injectable()
export class PrismaEspaciosRepository implements IEspaciosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<EspacioParqueo> {
    return this.prisma.espacioParqueo.create({ data: datos });
  }

  async obtenerDisponibles(): Promise<EspacioParqueo[]> {
    return this.prisma.espacioParqueo.findMany({
      where: { estado_id: 1 }, // Asumiendo que el ID 1 es "Disponible"
      include: { nivel: true, tipo_vehiculo: true },
    });
  }

  async buscarPorId(id: number): Promise<EspacioParqueo | null> {
    return this.prisma.espacioParqueo.findUnique({ where: { id } });
  }

  async actualizar(id: number, datos: any): Promise<EspacioParqueo> {
    return this.prisma.espacioParqueo.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: number): Promise<EspacioParqueo> {
    return this.prisma.espacioParqueo.update({ where: { id }, data: { activo: false } });
  }
}