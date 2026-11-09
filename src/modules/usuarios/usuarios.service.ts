import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { USUARIOS_REPOSITORY } from './repositories/usuarios.repository.interface.js';
import type { IUsuariosRepository } from './repositories/usuarios.repository.interface.js';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(USUARIOS_REPOSITORY)
    private readonly usuariosRepository: IUsuariosRepository,
  ) {}

  async registrarUsuario(datos: any) {
    const existe = await this.usuariosRepository.buscarPorEmail(datos.email);
    if (existe) {
      throw new UnprocessableEntityException(`El email ${datos.email} ya está registrado.`);
    }
    return this.usuariosRepository.crear({ ...datos, estado: 'ACTIVO' });
  }

  async obtenerTodos() {
    return this.usuariosRepository.obtenerTodos();
  }

  async actualizarUsuario(idOrEmail: string | number, datos: any) {
    let usuario;
    if (typeof idOrEmail === 'number' || (!isNaN(Number(idOrEmail)) && !String(idOrEmail).includes('@'))) {
      usuario = await this.usuariosRepository.buscarPorId(Number(idOrEmail));
    } else {
      usuario = await this.usuariosRepository.buscarPorEmail(String(idOrEmail));
    }
    if (!usuario) {
      throw new NotFoundException(`El usuario ${idOrEmail} no existe.`);
    }
    return this.usuariosRepository.actualizar(idOrEmail, datos);
  }

  async eliminarUsuario(email: string) {
    const usuario = await this.usuariosRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new NotFoundException(`El usuario con email ${email} no existe.`);
    }
    return this.usuariosRepository.eliminar(email);
  }
}