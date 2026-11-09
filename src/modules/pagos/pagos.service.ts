import { Injectable, Inject, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PAGOS_REPOSITORY } from './repositories/pagos.repository.interface.js';
import type { IPagosRepository } from './repositories/pagos.repository.interface.js';

@Injectable()
export class PagosService {
  constructor(
    @Inject(PAGOS_REPOSITORY)
    private readonly pagosRepository: IPagosRepository,
  ) {}

  async procesarPago(datos: any) {
    const ticket = await this.pagosRepository.obtenerTicketPorId(datos.ticket_id);
    if (!ticket) {
      throw new NotFoundException(`El ticket con ID ${datos.ticket_id} no existe.`);
    }

    if (ticket.estado === 'PAGADO') {
      throw new UnprocessableEntityException('El ticket ya se encuentra pagado.');
    }
    if (ticket.estado !== 'FINALIZADO') {
      throw new UnprocessableEntityException(
        'El ticket debe tener una salida registrada antes de procesar el pago.',
      );
    }

    return this.pagosRepository.registrarPagoYMarcarTicketComoPagado({
      ticket_id: datos.ticket_id,
      total_pagado: datos.total_pagado,
      metodo_pago_id: datos.metodo_pago_id,
      fecha_pago: new Date(),
      numero_autorizacion: datos.numero_autorizacion,
      requiere_fel: datos.requiere_fel ?? false,
    });
  }

  async buscarPorId(id: number) {
    const pago = await this.pagosRepository.buscarPorId(id);
    if (!pago) {
      throw new NotFoundException(`El pago con ID ${id} no existe.`);
    }
    return pago;
  }

  async actualizarPago(id: number, datos: any) {
    await this.buscarPorId(id);
    return this.pagosRepository.actualizar(id, datos);
  }

  async actualizarPagoPorTicket(ticketId: number, datos: any) {
    const ticket = await this.pagosRepository.obtenerTicketPorId(ticketId);
    if (!ticket) {
      throw new NotFoundException(`El ticket con ID ${ticketId} no existe.`);
    }
    return this.pagosRepository.actualizarPorTicketId(ticketId, datos);
  }

  async eliminarPago(ticketId: number) {
    const ticket = await this.pagosRepository.obtenerTicketPorId(ticketId);
    if (!ticket) {
      throw new NotFoundException(`El ticket con ID ${ticketId} no existe.`);
    }
    return this.pagosRepository.eliminarPorTicketId(ticketId);
  }
}