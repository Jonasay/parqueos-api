import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { SUCURSALES_REPOSITORY } from './repositories/sucursales.repository.interface.js';
import type { ISucursalesRepository } from './repositories/sucursales.repository.interface.js';

@Injectable()
export class SucursalesService {
  constructor(
    @Inject(SUCURSALES_REPOSITORY)
    private readonly sucursalesRepository: ISucursalesRepository,
  ) {}

  async registrarSucursal(datos: any) {
    const existe = await this.sucursalesRepository.buscarPorNombre(datos.nombre);
    if (existe) {
      throw new UnprocessableEntityException(`Ya existe una sucursal registrada con el nombre '${datos.nombre}'.`);
    }
    return this.sucursalesRepository.crear(datos);
  }

  async obtenerSucursales() {
    return this.sucursalesRepository.obtenerTodas();
  }

  async buscarPorId(id: number) {
    const sucursal = await this.sucursalesRepository.buscarPorId(id);
    if (!sucursal) {
      throw new NotFoundException(`La sucursal con ID ${id} no fue encontrada.`);
    }
    return sucursal;
  }
}