import { Injectable } from '@nestjs/common';
import { IClientesRepository } from './clientes.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Cliente } from '@prisma/client';

@Injectable()
export class PrismaClientesRepository implements IClientesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<Cliente> {
    return this.prisma.cliente.create({ data: datos });
  }

  async buscarPorUsuarioId(usuarioId: number): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({ where: { usuario_id: usuarioId } });
  }

  async obtenerTodos(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany();
  }
}