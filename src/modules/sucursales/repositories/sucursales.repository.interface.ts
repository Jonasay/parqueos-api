import { Sucursal } from '@prisma/client';

export const SUCURSALES_REPOSITORY = 'SUCURSALES_REPOSITORY';

export interface ISucursalesRepository {
  crear(datos: any): Promise<Sucursal>;
  buscarPorNombre(nombre: string): Promise<Sucursal | null>;
  obtenerTodas(): Promise<Sucursal[]>;
  buscarPorId(id: number): Promise<Sucursal | null>;
  actualizar(id: number, datos: any): Promise<Sucursal>;
  eliminar(id: number): Promise<Sucursal>;
}