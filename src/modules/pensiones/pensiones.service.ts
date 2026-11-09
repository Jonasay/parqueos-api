import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import {PENSIONES_REPOSITORY } from './repositories/pensiones.repository.interface.js';
import type { IPensionesRepository } from './repositories/pensiones.repository.interface.js';

@Injectable()
export class PensionesService {
  constructor(
    @Inject(PENSIONES_REPOSITORY)
    private readonly pensionesRepository: IPensionesRepository,
  ) {}

  async registrarPension(datos: any) {
    const fechaActual = new Date();
    const pensionActiva = await this.pensionesRepository.buscarActivaPorVehiculo(datos.vehiculo_id, fechaActual);
    
    if (pensionActiva) {
      throw new UnprocessableEntityException(`El vehículo ID ${datos.vehiculo_id} ya posee una pensión activa.`);
    }

    return this.pensionesRepository.crear({ ...datos, estado_pago: 'ACTIVA' });
  }

  async obtenerTodas() {
    return this.pensionesRepository.obtenerTodas();
  }

  async verificarAcceso(vehiculoId: number) {
    const fechaActual = new Date();
    const pension = await this.pensionesRepository.buscarActivaPorVehiculo(vehiculoId, fechaActual);
    
    if (!pension) {
      throw new NotFoundException(`No se encontró una pensión activa y válida para el vehículo ID ${vehiculoId}.`);
    }
    return pension;
  }

  async buscarPorId(id: number) {
    const pension = await this.pensionesRepository.buscarPorId(id);
    if (!pension) {
      throw new NotFoundException(`Pensión con ID ${id} no encontrada.`);
    }
    return pension;
  }

  async actualizarPension(id: number, datos: any) {
    await this.buscarPorId(id);
    return this.pensionesRepository.actualizar(id, datos);
  }

  async actualizarPensionPorVehiculo(vehiculoId: number, datos: any) {
    const pension = await this.verificarAcceso(vehiculoId);
    return this.pensionesRepository.actualizar(pension.id, datos);
  }

  async eliminarPension(vehiculoId: number) {
    const pension = await this.verificarAcceso(vehiculoId);
    return this.pensionesRepository.eliminar(pension.id);
  }
}