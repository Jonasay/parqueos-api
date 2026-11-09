import { Injectable } from '@nestjs/common';
import { IEstadosEspacioRepository } from './estados-espacio.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { EstadoEspacio } from '@prisma/client';

@Injectable()
export class PrismaEstadosEspacioRepository implements IEstadosEspacioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<EstadoEspacio> {
    return this.prisma.estadoEspacio.create({ data: datos });
  }

  async buscarPorNombre(nombre: string): Promise<EstadoEspacio | null> {
    return this.prisma.estadoEspacio.findFirst({ where: { nombre } });
  }

  async buscarPorId(id: number): Promise<EstadoEspacio | null> {
    return this.prisma.estadoEspacio.findUnique({ where: { id } });
  }

  async obtenerTodos(): Promise<EstadoEspacio[]> {
    return this.prisma.estadoEspacio.findMany();
  }

  async actualizar(id: number, datos: any): Promise<EstadoEspacio> {
    return this.prisma.estadoEspacio.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: number): Promise<EstadoEspacio> {
    return this.prisma.estadoEspacio.update({ where: { id }, data: { activo: false } });
  }
}