import { Injectable } from '@nestjs/common';
import { IAuditLogsRepository } from './audit-logs.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AuditLog } from '@prisma/client';

@Injectable()
export class PrismaAuditLogsRepository implements IAuditLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data: datos });
  }

  async obtenerTodos(): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({ include: { usuario: true }, orderBy: { fecha_hora: 'desc' } });
  }

  async buscarPorUsuario(usuarioId: number): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_hora: 'desc' },
    });
  }

  async buscarPorId(id: number): Promise<AuditLog | null> {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  async actualizar(id: number, datos: any): Promise<AuditLog> {
    return this.prisma.auditLog.update({
      where: { id },
      data: datos,
    });
  }

  async eliminarPorUsuario(usuarioId: number): Promise<any> {
    return this.prisma.auditLog.updateMany({
      where: { usuario_id: usuarioId },
      data: { activo: false },
    });
  }
}