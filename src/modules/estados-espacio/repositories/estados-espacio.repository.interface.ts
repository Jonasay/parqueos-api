import { EstadoEspacio } from '@prisma/client'; 

export const ESTADOS_ESPACIO_REPOSITORY = 'ESTADOS_ESPACIO_REPOSITORY';

export interface IEstadosEspacioRepository {
  crear(datos: any): Promise<EstadoEspacio>;
  buscarPorNombre(nombre: string): Promise<EstadoEspacio | null>;
  buscarPorId(id: number): Promise<EstadoEspacio | null>;
  obtenerTodos(): Promise<EstadoEspacio[]>;
  actualizar(id: number, datos: any): Promise<EstadoEspacio>;
  eliminar(id: number): Promise<EstadoEspacio>;
}