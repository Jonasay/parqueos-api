import { Pension } from '@prisma/client'; // Asegúrate de que tu modelo en schema.prisma se llame Pension

export const PENSIONES_REPOSITORY = 'PENSIONES_REPOSITORY';

export interface IPensionesRepository {
  crear(datos: any): Promise<Pension>;
  buscarActivaPorVehiculo(vehiculoId: number, fechaActual: Date): Promise<Pension | null>;
  obtenerTodas(): Promise<Pension[]>;
}