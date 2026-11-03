import { TipoVehiculo } from '@prisma/client'; 

export const TIPOS_VEHICULO_REPOSITORY = 'TIPOS_VEHICULO_REPOSITORY';

export interface ITiposVehiculoRepository {
  crear(datos: any): Promise<TipoVehiculo>;
  buscarPorNombre(nombre: string): Promise<TipoVehiculo | null>;
  buscarPorId(id: number): Promise<TipoVehiculo | null>;
  obtenerTodos(): Promise<TipoVehiculo[]>;
}