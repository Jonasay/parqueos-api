import { Usuario } from '@prisma/client';

export const USUARIOS_REPOSITORY = 'USUARIOS_REPOSITORY';

export interface IUsuariosRepository {
  crear(datos: any): Promise<Usuario>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  obtenerTodos(): Promise<Usuario[]>;
  eliminar(email: string): Promise<Usuario>;
}