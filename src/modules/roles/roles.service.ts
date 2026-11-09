import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ROLES_REPOSITORY } from './repositories/roles.repository.interface.js';
import type { IRolesRepository } from './repositories/roles.repository.interface.js';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async registrarRol(datos: any) {
    const existe = await this.rolesRepository.buscarPorNombre(datos.nombre);
    if (existe) {
      throw new UnprocessableEntityException(`El rol '${datos.nombre}' ya se encuentra registrado.`);
    }
    return this.rolesRepository.crear(datos);
  }

  async obtenerTodos() {
    return this.rolesRepository.obtenerTodos();
  }

  async buscarPorId(id: number) {
    const rol = await this.rolesRepository.buscarPorId(id);
    if (!rol) {
      throw new NotFoundException(`El rol con ID ${id} no existe.`);
    }
    return rol;
  }

  async actualizarRol(id: number, datos: any) {
    await this.buscarPorId(id);
    return this.rolesRepository.actualizar(id, datos);
  }

  async eliminarRol(id: number) {
    await this.buscarPorId(id);
    return this.rolesRepository.eliminar(id);
  }
}