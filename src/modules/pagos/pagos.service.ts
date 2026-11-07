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
    // 1. Validar existencia del ticket (Manejo de códigos HTTP: 404)[cite: 7, 8]
    const ticket = await this.pagosRepository.obtenerTicketPorId(datos.ticket_id);
    if (!ticket) {
      throw new NotFoundException(`El ticket con ID ${datos.ticket_id} no existe.`);
    }

    // 2. Validar que no se pague dos veces (Manejo de códigos HTTP: 422)[cite: 7, 8]
    if (ticket.estado === 'PAGADO') {
      throw new UnprocessableEntityException('El ticket ya se encuentra pagado.');
    }

    // 3. Registrar el pago usando ORM
    const pagoRealizado = await this.pagosRepository.registrarPago({
      ticket_id: datos.ticket_id,
      total_pagado: datos.total_pagado,
      metodo_pago_id: datos.metodo_pago_id,
      fecha_pago: new Date(),
      numero_autorizacion: datos.numero_autorizacion,
      requiere_fel: datos.requiere_fel ?? false,
    });

    // 4. Actualizar estado del ticket
    await this.pagosRepository.marcarTicketComoPagado(datos.ticket_id);

    return pagoRealizado;
  }

  async eliminarPago(ticketId: number) {
    const ticket = await this.pagosRepository.obtenerTicketPorId(ticketId);
    if (!ticket) {
      throw new NotFoundException(`El ticket con ID ${ticketId} no existe.`);
    }
    return this.pagosRepository.eliminarPorTicketId(ticketId);
  }
}