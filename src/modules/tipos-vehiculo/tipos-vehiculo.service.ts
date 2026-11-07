import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TIPOS_VEHICULO_REPOSITORY } from './repositories/tipos-vehiculo.repository.interface.js';
import type { ITiposVehiculoRepository } from './repositories/tipos-vehiculo.repository.interface.js';

@Injectable()
export class TiposVehiculoService {
  constructor(
    @Inject(TIPOS_VEHICULO_REPOSITORY)
    private readonly tiposVehiculoRepository: ITiposVehiculoRepository,
  ) {}

  async registrarTipo(datos: any) {
    const existe = await this.tiposVehiculoRepository.buscarPorNombre(datos.nombre);
    if (existe) {
      throw new UnprocessableEntityException(`El tipo de vehículo '${datos.nombre}' ya está registrado.`);
    }
    return this.tiposVehiculoRepository.crear(datos);
  }

  async obtenerTodos() {
    return this.tiposVehiculoRepository.obtenerTodos();
  }

  async buscarPorId(id: number) {
    const tipo = await this.tiposVehiculoRepository.buscarPorId(id);
    if (!tipo) {
      throw new NotFoundException(`El tipo de vehículo con ID ${id} no existe.`);
    }
    return tipo;
  }

  async eliminarTipo(id: number) {
    await this.buscarPorId(id);
    return this.tiposVehiculoRepository.eliminar(id);
  }
}