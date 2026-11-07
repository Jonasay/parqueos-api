import { NivelParqueo } from '@prisma/client'; // Asegúrate de que el modelo se llame NivelParqueo en schema.prisma

export const NIVELES_PARQUEO_REPOSITORY = 'NIVELES_PARQUEO_REPOSITORY';

export interface INivelesParqueoRepository {
  crear(datos: any): Promise<NivelParqueo>;
  buscarPorNombreYSucursal(nombreNivel: string, sucursalId: number): Promise<NivelParqueo | null>;
  buscarPorId(id: number): Promise<NivelParqueo | null>;
  obtenerPorSucursal(sucursalId: number): Promise<NivelParqueo[]>;
  eliminar(id: number): Promise<NivelParqueo>;
}