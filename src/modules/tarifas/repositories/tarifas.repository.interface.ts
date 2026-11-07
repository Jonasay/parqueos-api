import { Tarifa } from '@prisma/client';

export const TARIFAS_REPOSITORY = 'TARIFAS_REPOSITORY';

export interface ITarifasRepository {
  crear(datos: any): Promise<Tarifa>;
  buscarPorTipoVehiculo(tipoVehiculoId: number): Promise<Tarifa | null>;
  obtenerTodas(): Promise<Tarifa[]>;
  eliminar(id: number): Promise<Tarifa>;
}