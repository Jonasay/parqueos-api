import { Rol } from '@prisma/client'; 

export const ROLES_REPOSITORY = 'ROLES_REPOSITORY';

export interface IRolesRepository {
  crear(datos: any): Promise<Rol>;
  buscarPorNombre(nombre: string): Promise<Rol | null>;
  buscarPorId(id: number): Promise<Rol | null>;
  obtenerTodos(): Promise<Rol[]>;
  eliminar(id: number): Promise<Rol>;
}