import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EMPLEADOS_REPOSITORY } from './repositories/empleados.repository.interface.js';
import type { IEmpleadosRepository } from './repositories/empleados.repository.interface.js';

@Injectable()
export class EmpleadosService {
  constructor(
    @Inject(EMPLEADOS_REPOSITORY)
    private readonly empleadosRepository: IEmpleadosRepository,
  ) {}

  async registrarEmpleado(datos: any) {
    const usuarioAsignado = await this.empleadosRepository.buscarPorUsuarioId(datos.usuario_id);
    if (usuarioAsignado) {
      throw new UnprocessableEntityException(`El usuario ID ${datos.usuario_id} ya tiene un perfil de empleado.`);
    }

    const dpiExistente = await this.empleadosRepository.buscarPorDpi(datos.dpi);
    if (dpiExistente) {
      throw new UnprocessableEntityException(`El DPI ${datos.dpi} ya está registrado.`);
    }

    return this.empleadosRepository.crear(datos);
  }

  async obtenerTodos() {
    return this.empleadosRepository.obtenerTodos();
  }

  async buscarPorDpi(dpi: string) {
    const empleado = await this.empleadosRepository.buscarPorDpi(dpi);
    if (!empleado) {
      throw new NotFoundException(`Empleado con DPI ${dpi} no encontrado.`);
    }
    return empleado;
  }

  async actualizarEmpleado(usuarioId: number, datos: any) {
    const empleado = await this.empleadosRepository.buscarPorUsuarioId(usuarioId);
    if (!empleado) {
      throw new NotFoundException(`Empleado con usuario ID ${usuarioId} no encontrado.`);
    }
    return this.empleadosRepository.actualizar(usuarioId, datos);
  }

  async eliminarEmpleado(usuarioId: number) {
    const empleado = await this.empleadosRepository.buscarPorUsuarioId(usuarioId);
    if (!empleado) {
      throw new NotFoundException(`Empleado con usuario ID ${usuarioId} no encontrado.`);
    }
    return this.empleadosRepository.eliminar(usuarioId);
  }
}
