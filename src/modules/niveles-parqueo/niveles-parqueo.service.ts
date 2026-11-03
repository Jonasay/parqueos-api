import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { NIVELES_PARQUEO_REPOSITORY } from './repositories/niveles-parqueo.repository.interface.js';
import type { INivelesParqueoRepository } from './repositories/niveles-parqueo.repository.interface.js';
@Injectable()
export class NivelesParqueoService {
  constructor(
    @Inject(NIVELES_PARQUEO_REPOSITORY)
    private readonly nivelesParqueoRepository: INivelesParqueoRepository,
  ) {}

  async registrarNivel(datos: any) {
    const existe = await this.nivelesParqueoRepository.buscarPorNombreYSucursal(datos.nombre_nivel, datos.sucursal_id);
    if (existe) {
      throw new UnprocessableEntityException(`El nivel '${datos.nombre_nivel}' ya existe en la sucursal especificada.`);
    }
    return this.nivelesParqueoRepository.crear(datos);
  }

  async buscarPorId(id: number) {
    const nivel = await this.nivelesParqueoRepository.buscarPorId(id);
    if (!nivel) {
      throw new NotFoundException(`El nivel con ID ${id} no fue encontrado.`);
    }
    return nivel;
  }

  async obtenerPorSucursal(sucursalId: number) {
    return this.nivelesParqueoRepository.obtenerPorSucursal(sucursalId);
  }
}
