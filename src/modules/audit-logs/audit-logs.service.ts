import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AUDIT_LOGS_REPOSITORY } from './repositories/audit-logs.repository.interface.js';
import type { IAuditLogsRepository } from './repositories/audit-logs.repository.interface.js';

@Injectable()
export class AuditLogsService {
  constructor(
    @Inject(AUDIT_LOGS_REPOSITORY)
    private readonly auditLogsRepository: IAuditLogsRepository,
  ) {}

  async registrarAccion(datos: any) {
    return this.auditLogsRepository.crear({
      ...datos,
      fecha_hora: new Date(),
    });
  }

  async obtenerHistorial() {
    return this.auditLogsRepository.obtenerTodos();
  }

  async obtenerHistorialPorUsuario(usuarioId: number) {
    return this.auditLogsRepository.buscarPorUsuario(usuarioId);
  }

  async buscarPorId(id: number) {
    const log = await this.auditLogsRepository.buscarPorId(id);
    if (!log) {
      throw new NotFoundException(`Registro de auditoría con ID ${id} no encontrado.`);
    }
    return log;
  }

  async actualizarLog(id: number, datos: any) {
    await this.buscarPorId(id);
    return this.auditLogsRepository.actualizar(id, datos);
  }

  async eliminarLog(usuarioId: number) {
    const logs = await this.auditLogsRepository.buscarPorUsuario(usuarioId);
    if (!logs || logs.length === 0) {
      throw new NotFoundException(`No existen registros de auditoría para el usuario con ID ${usuarioId}.`);
    }
    return this.auditLogsRepository.eliminarPorUsuario(usuarioId);
  }
}
