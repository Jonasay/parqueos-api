import { MetodoPago } from '@prisma/client'; 

export const METODOS_PAGO_REPOSITORY = 'METODOS_PAGO_REPOSITORY';

export interface IMetodosPagoRepository {
  crear(datos: any): Promise<MetodoPago>;
  buscarPorNombre(nombre: string): Promise<MetodoPago | null>;
  buscarPorId(id: number): Promise<MetodoPago | null>;
  obtenerTodos(): Promise<MetodoPago[]>;
  actualizar(id: number, datos: any): Promise<MetodoPago>;
  eliminar(id: number): Promise<MetodoPago>;
}