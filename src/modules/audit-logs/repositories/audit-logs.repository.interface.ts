import { AuditLog } from '@prisma/client'; // Asegúrate de que el modelo se llame AuditLog en schema.prisma

export const AUDIT_LOGS_REPOSITORY = 'AUDIT_LOGS_REPOSITORY';

export interface IAuditLogsRepository {
  crear(datos: any): Promise<AuditLog>;
  obtenerTodos(): Promise<AuditLog[]>;
  buscarPorUsuario(usuarioId: number): Promise<AuditLog[]>;
  eliminarPorUsuario(usuarioId: number): Promise<any>;
}