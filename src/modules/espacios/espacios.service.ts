import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ESPACIOS_REPOSITORY } from './repositories/espacios.repository.interface.js';
import type { IEspaciosRepository } from './repositories/espacios.repository.interface.js';

@Injectable()
export class EspaciosService {
  constructor(
    @Inject(ESPACIOS_REPOSITORY)
    private readonly espaciosRepository: IEspaciosRepository,
  ) {}

  async crearEspacio(datos: any) {
    return this.espaciosRepository.crear(datos);
  }

  async consultarDisponibles() {
    return this.espaciosRepository.obtenerDisponibles();
  }

  async buscarPorId(id: number) {
    const espacio = await this.espaciosRepository.buscarPorId(id);
    if (!espacio) {
      throw new NotFoundException(`Espacio con ID ${id} no encontrado.`); // Cumple manejo de errores HTTP (404)
    }
    return espacio;
  }

  async actualizarEspacio(id: number, datos: any) {
    await this.buscarPorId(id);
    return this.espaciosRepository.actualizar(id, datos);
  }

  async eliminarEspacio(id: number) {
    await this.buscarPorId(id);
    return this.espaciosRepository.eliminar(id);
  }
}