import { Injectable } from '@nestjs/common';
import { IRolesRepository } from './roles.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Rol } from '@prisma/client';

@Injectable()
export class PrismaRolesRepository implements IRolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Rol> {
    return this.prisma.rol.create({ data: datos });
  }

  async buscarPorNombre(nombre: string): Promise<Rol | null> {
    return this.prisma.rol.findFirst({ where: { nombre } });
  }

  async buscarPorId(id: number): Promise<Rol | null> {
    return this.prisma.rol.findUnique({ where: { id } });
  }

  async obtenerTodos(): Promise<Rol[]> {
    return this.prisma.rol.findMany();
  }

  async eliminar(id: number): Promise<Rol> {
    return this.prisma.rol.update({ where: { id }, data: { activo: false } });
  }
}