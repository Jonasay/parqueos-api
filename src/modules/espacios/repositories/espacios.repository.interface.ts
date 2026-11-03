import { EspacioParqueo } from '@prisma/client';

export const ESPACIOS_REPOSITORY = 'ESPACIOS_REPOSITORY';

export interface IEspaciosRepository {
  crear(datos: any): Promise<EspacioParqueo>;
  obtenerDisponibles(): Promise<EspacioParqueo[]>;
  buscarPorId(id: number): Promise<EspacioParqueo | null>;
}