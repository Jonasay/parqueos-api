import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TARIFAS_REPOSITORY } from './repositories/tarifas.repository.interface.js';
import type { ITarifasRepository } from './repositories/tarifas.repository.interface.js';

@Injectable()
export class TarifasService {
  constructor(
    @Inject(TARIFAS_REPOSITORY)
    private readonly tarifasRepository: ITarifasRepository,
  ) {}

  async registrarTarifa(datos: any) {
    const tarifaExistente = await this.tarifasRepository.buscarPorTipoVehiculo(datos.tipo_vehiculo_id);
    if (tarifaExistente) {
      throw new UnprocessableEntityException(`Ya existe una tarifa activa para el tipo de vehículo ID ${datos.tipo_vehiculo_id}.`);
    }
    return this.tarifasRepository.crear({ ...datos, estado_activo: datos.estado_activo ?? true });
  }

  async obtenerTarifas() {
    return this.tarifasRepository.obtenerTodas();
  }

  async buscarTarifaActiva(tipoVehiculoId: number) {
    const tarifa = await this.tarifasRepository.buscarPorTipoVehiculo(tipoVehiculoId);
    if (!tarifa) {
      throw new NotFoundException(`No hay tarifa activa para el vehículo ID ${tipoVehiculoId}.`);
    }
    return tarifa;
  }
}