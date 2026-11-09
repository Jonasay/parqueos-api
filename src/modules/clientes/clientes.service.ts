import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CLIENTES_REPOSITORY } from './repositories/clientes.repository.interface.js';
import type { IClientesRepository } from './repositories/clientes.repository.interface.js';

@Injectable()
export class ClientesService {
  constructor(
    @Inject(CLIENTES_REPOSITORY)
    private readonly clientesRepository: IClientesRepository,
  ) {}

  async registrarCliente(datos: any) {
    const existe = await this.clientesRepository.buscarPorUsuarioId(datos.usuario_id);
    if (existe) {
      throw new UnprocessableEntityException(`El usuario ID ${datos.usuario_id} ya tiene un perfil de cliente.`);
    }
    return this.clientesRepository.crear(datos);
  }

  async buscarPorUsuarioId(usuarioId: number) {
    const cliente = await this.clientesRepository.buscarPorUsuarioId(usuarioId);
    if (!cliente) {
      throw new NotFoundException(`Cliente con usuario ID ${usuarioId} no encontrado.`);
    }
    return cliente;
  }

  async obtenerTodos() {
    return this.clientesRepository.obtenerTodos();
  }

  async actualizarCliente(usuarioId: number, datos: any) {
    await this.buscarPorUsuarioId(usuarioId);
    return this.clientesRepository.actualizar(usuarioId, datos);
  }

  async eliminarCliente(usuarioId: number) {
    await this.buscarPorUsuarioId(usuarioId);
    return this.clientesRepository.eliminar(usuarioId);
  }
}