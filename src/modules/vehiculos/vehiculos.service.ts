import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import {  VEHICULOS_REPOSITORY } from './repositories/vehiculos.repository.interface.js';
import type { IVehiculosRepository } from './repositories/vehiculos.repository.interface.js';

@Injectable()
export class VehiculosService {
  constructor(
    @Inject(VEHICULOS_REPOSITORY)
    private readonly vehiculosRepository: IVehiculosRepository,
  ) {}

  async registrarVehiculo(datos: any) {
    const existe = await this.vehiculosRepository.buscarPorPlaca(datos.placa);
    if (existe) {
      // Manejo estricto de códigos HTTP (422 Unprocessable Entity)
      throw new UnprocessableEntityException(`El vehículo con placa ${datos.placa} ya está registrado.`);
    }
    return this.vehiculosRepository.crear(datos);
  }

  async buscarPorPlaca(placa: string) {
    const vehiculo = await this.vehiculosRepository.buscarPorPlaca(placa);
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con placa ${placa} no encontrado.`); // Error 404
    }
    return vehiculo;
  }

  async obtenerTodos() {
    return this.vehiculosRepository.obtenerTodos();
  }

  async eliminarVehiculo(placa: string) {
    await this.buscarPorPlaca(placa);
    return this.vehiculosRepository.eliminar(placa);
  }
}