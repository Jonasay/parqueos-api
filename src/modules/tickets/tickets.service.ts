import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TICKETS_REPOSITORY } from './repositories/tickets.repository.interface.js';
import type {
  ITicketsRepository,
  RegistrarEntradaData,
  TicketWithRelations,
} from './repositories/tickets.repository.interface.js';

export interface TicketResponse {
  id: number;
  codigo: string;
  placa: string;
  espacio_id: number;
  hora_entrada: Date;
  hora_salida: Date | null;
  estado: string;
}

@Injectable()
export class TicketsService {
  constructor(
    @Inject(TICKETS_REPOSITORY)
    private readonly ticketsRepository: ITicketsRepository,
  ) {}

  async registrarEntrada(datos: RegistrarEntradaData): Promise<TicketResponse> {
    return this.toTicketResponse(await this.ticketsRepository.registrarEntrada(datos));
  }

  async listar(): Promise<TicketResponse[]> {
    const tickets = await this.ticketsRepository.listar();
    return tickets.map((ticket) => this.toTicketResponse(ticket));
  }

  async procesarSalida(codigoTicket: string): Promise<TicketResponse> {
    const ticket = await this.ticketsRepository.buscarPorCodigo(codigoTicket);
    if (!ticket) {
      throw new NotFoundException(`El ticket ${codigoTicket} no existe.`);
    }

    if (ticket.estado !== 'ACTIVO') {
      throw new UnprocessableEntityException('El ticket ya fue procesado.');
    }

    return this.toTicketResponse(
      await this.ticketsRepository.actualizarSalida(ticket.id, new Date()),
    );
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

  private toTicketResponse(ticket: TicketWithRelations): TicketResponse {
    return {
      id: ticket.id,
      codigo: ticket.codigo_ticket,
      placa: ticket.vehiculo.placa,
      espacio_id: ticket.espacio_id,
      hora_entrada: ticket.hora_entrada,
      hora_salida: ticket.hora_salida,
      estado: ticket.estado,
    };
  }
}
