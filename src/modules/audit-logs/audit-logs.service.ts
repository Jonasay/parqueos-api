import { Injectable, Inject } from '@nestjs/common';
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
}
