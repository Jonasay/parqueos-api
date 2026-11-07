import { Vehiculo } from '@prisma/client';

export const VEHICULOS_REPOSITORY = 'VEHICULOS_REPOSITORY';

export interface IVehiculosRepository {
  crear(datos: any): Promise<Vehiculo>;
  buscarPorPlaca(placa: string): Promise<Vehiculo | null>;
  obtenerTodos(): Promise<Vehiculo[]>;
  eliminar(placa: string): Promise<Vehiculo>;
}