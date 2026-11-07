import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ESTADOS_ESPACIO_REPOSITORY } from './repositories/estados-espacio.repository.interface.js';
import type { IEstadosEspacioRepository } from './repositories/estados-espacio.repository.interface.js';


@Injectable()
export class EstadosEspacioService {
  constructor(
    @Inject(ESTADOS_ESPACIO_REPOSITORY)
    private readonly estadosEspacioRepository: IEstadosEspacioRepository,
  ) {}

  async registrarEstado(datos: any) {
    const existe = await this.estadosEspacioRepository.buscarPorNombre(datos.nombre);
    if (existe) {
      throw new UnprocessableEntityException(`El estado de espacio '${datos.nombre}' ya existe.`);
    }
    return this.estadosEspacioRepository.crear(datos);
  }

  async obtenerTodos() {
    return this.estadosEspacioRepository.obtenerTodos();
  }

  async buscarPorId(id: number) {
    const estado = await this.estadosEspacioRepository.buscarPorId(id);
    if (!estado) {
      throw new NotFoundException(`El estado con ID ${id} no existe.`);
    }
    return estado;
  }

  async eliminarEstado(id: number) {
    await this.buscarPorId(id);
    return this.estadosEspacioRepository.eliminar(id);
  }
}