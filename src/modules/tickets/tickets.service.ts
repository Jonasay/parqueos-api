import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TICKETS_REPOSITORY } from './repositories/tickets.repository.interface.js';
import type { ITicketsRepository, RegistrarEntradaData } from './repositories/tickets.repository.interface.js';

@Injectable()
export class TicketsService {
  constructor(
    @Inject(TICKETS_REPOSITORY)
    private readonly ticketsRepository: ITicketsRepository,
  ) {}

  async registrarEntrada(datos: RegistrarEntradaData) {
    // Aquí podrías agregar la lógica para verificar si el espacio está disponible
    return this.ticketsRepository.registrarEntrada(datos);
  }

  async procesarSalida(codigoTicket: string) {
    const ticket = await this.ticketsRepository.buscarPorCodigo(codigoTicket);
    
    if (!ticket) {
      throw new NotFoundException(`El ticket ${codigoTicket} no existe.`); 
    }
    
    if (ticket.estado !== 'ACTIVO') {
      throw new UnprocessableEntityException('El ticket ya fue procesado.'); 
    }

    const horaSalida = new Date();

    
    return this.ticketsRepository.actualizarSalida(ticket.id, horaSalida);
  }

  async actualizarTicket(codigoTicket: string, datos: any) {
    const ticket = await this.ticketsRepository.buscarPorCodigo(codigoTicket);
    if (!ticket) {
      throw new NotFoundException(`El ticket ${codigoTicket} no existe.`);
    }
    return this.ticketsRepository.actualizar(codigoTicket, datos);
  }

  async eliminarTicket(codigoTicket: string) {
    const ticket = await this.ticketsRepository.buscarPorCodigo(codigoTicket);
    if (!ticket) {
      throw new NotFoundException(`El ticket ${codigoTicket} no existe.`);
    }
    return this.ticketsRepository.eliminar(codigoTicket);
  }
}