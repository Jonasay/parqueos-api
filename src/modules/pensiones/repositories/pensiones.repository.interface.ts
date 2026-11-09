import { Pension } from '@prisma/client'; // Asegúrate de que tu modelo en schema.prisma se llame Pension

export const PENSIONES_REPOSITORY = 'PENSIONES_REPOSITORY';

export interface IPensionesRepository {
  crear(datos: any): Promise<Pension>;
  buscarActivaPorVehiculo(vehiculoId: number, fechaActual: Date): Promise<Pension | null>;
  buscarPorId(id: number): Promise<Pension | null>;
  obtenerTodas(): Promise<Pension[]>;
  actualizar(id: number, datos: any): Promise<Pension>;
  eliminar(id: number): Promise<Pension>;
}