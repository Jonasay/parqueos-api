import { Cliente } from '@prisma/client';

export const CLIENTES_REPOSITORY = 'CLIENTES_REPOSITORY';

export interface IClientesRepository {
  crear(datos: any): Promise<Cliente>;
  buscarPorUsuarioId(usuarioId: number): Promise<Cliente | null>;
  obtenerTodos(): Promise<Cliente[]>;
}