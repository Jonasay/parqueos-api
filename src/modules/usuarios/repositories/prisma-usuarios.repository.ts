import { Injectable } from '@nestjs/common';
import { IUsuariosRepository } from './usuarios.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Usuario } from '@prisma/client';

@Injectable()
export class PrismaUsuariosRepository implements IUsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Usuario> {
    return this.prisma.usuario.create({ data: datos });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      include: { rol: true, empleado: true }
    });
  }

  async actualizar(idOrEmail: string | number, datos: any): Promise<Usuario> {
    const where = typeof idOrEmail === 'number' || (!isNaN(Number(idOrEmail)) && !String(idOrEmail).includes('@'))
      ? { id: Number(idOrEmail) }
      : { email: String(idOrEmail) };
    return this.prisma.usuario.update({
      where,
      data: datos,
    });
  }

  async eliminar(email: string): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { email },
      data: { estado: 'INACTIVO', activo: false },
    });
  }
}