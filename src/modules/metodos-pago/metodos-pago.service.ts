import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { METODOS_PAGO_REPOSITORY } from './repositories/metodos-pago.repository.interface.js';
import type { IMetodosPagoRepository } from './repositories/metodos-pago.repository.interface.js';

@Injectable()
export class MetodosPagoService {
  constructor(
    @Inject(METODOS_PAGO_REPOSITORY)
    private readonly metodosPagoRepository: IMetodosPagoRepository,
  ) {}

  async registrarMetodo(datos: any) {
    const existe = await this.metodosPagoRepository.buscarPorNombre(datos.nombre);
    if (existe) {
      throw new UnprocessableEntityException(`El método de pago '${datos.nombre}' ya existe.`);
    }
    return this.metodosPagoRepository.crear(datos);
  }

  async obtenerTodos() {
    return this.metodosPagoRepository.obtenerTodos();
  }

  async buscarPorId(id: number) {
    const metodo = await this.metodosPagoRepository.buscarPorId(id);
    if (!metodo) {
      throw new NotFoundException(`El método de pago con ID ${id} no existe.`);
    }
    return metodo;
  }

  async eliminarMetodo(id: number) {
    await this.buscarPorId(id);
    return this.metodosPagoRepository.eliminar(id);
  }
}
