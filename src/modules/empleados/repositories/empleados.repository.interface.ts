import { Empleado } from '@prisma/client';

export const EMPLEADOS_REPOSITORY = 'EMPLEADOS_REPOSITORY';

export interface IEmpleadosRepository {
  crear(datos: any): Promise<Empleado>;
  buscarPorUsuarioId(usuarioId: number): Promise<Empleado | null>;
  buscarPorDpi(dpi: string): Promise<Empleado | null>;
  obtenerTodos(): Promise<Empleado[]>;
  eliminar(usuarioId: number): Promise<Empleado>;
}