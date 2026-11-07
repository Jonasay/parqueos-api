import { Injectable } from '@nestjs/common';
import { IEmpleadosRepository } from './empleados.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Empleado } from '@prisma/client';

@Injectable()
export class PrismaEmpleadosRepository implements IEmpleadosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Empleado> {
    return this.prisma.empleado.create({ data: datos });
  }

  async buscarPorUsuarioId(usuarioId: number): Promise<Empleado | null> {
    return this.prisma.empleado.findUnique({ where: { usuario_id: usuarioId } });
  }

  async buscarPorDpi(dpi: string): Promise<Empleado | null> {
    return this.prisma.empleado.findFirst({ where: { dpi } });
  }

  async obtenerTodos(): Promise<Empleado[]> {
    return this.prisma.empleado.findMany({ include: { usuario: true } });
  }

  async eliminar(usuarioId: number): Promise<Empleado> {
    return this.prisma.empleado.update({
      where: { usuario_id: usuarioId },
      data: { activo: false },
    });
  }
}