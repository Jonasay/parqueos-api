import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type {
  ITicketsRepository,
  RegistrarEntradaData,
  TicketWithRelations,
} from './tickets.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

const AVAILABLE_STATES = new Set(['DISPONIBLE', 'LIBRE']);
const OCCUPIED_STATES = new Set(['OCUPADO', 'NO DISPONIBLE']);
const TICKET_RELATIONS = { vehiculo: true, espacio: true } as const;

@Injectable()
export class PrismaTicketsRepository implements ITicketsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrarEntrada(datos: RegistrarEntradaData): Promise<TicketWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const employee = await transaction.empleado.findUnique({
        where: { usuario_id: datos.usuarioId },
      });
      if (!employee || !employee.activo) {
        throw new ForbiddenException(
          'El usuario autenticado no tiene un perfil activo de empleado.',
        );
      }

      const vehicle = datos.vehiculoId
        ? await transaction.vehiculo.findUnique({ where: { id: datos.vehiculoId } })
        : await transaction.vehiculo.findUnique({
            where: { placa: datos.placa!.trim().toUpperCase() },
          });
      if (!vehicle || !vehicle.activo) {
        throw new NotFoundException('No se encontró un vehículo activo con los datos indicados.');
      }

      const parkingSpace = await transaction.espacioParqueo.findUnique({
        where: { id: datos.espacioId },
        include: { estado: true },
      });
      if (!parkingSpace || !parkingSpace.activo) {
        throw new NotFoundException('No se encontró un espacio de parqueo activo.');
      }

      const states = await transaction.estadoEspacio.findMany({
        where: { activo: true },
      });
      const availableState = states.find((state) =>
        AVAILABLE_STATES.has(state.nombre.trim().toUpperCase()),
      );
      const occupiedState = states.find((state) =>
        OCCUPIED_STATES.has(state.nombre.trim().toUpperCase()),
      );
      if (!availableState || !occupiedState) {
        throw new InternalServerErrorException(
          'El catálogo de estados debe incluir estados activos de espacio disponible y ocupado.',
        );
      }
      if (parkingSpace.estado_id !== availableState.id) {
        throw new UnprocessableEntityException('El espacio de parqueo no está disponible.');
      }

      const claimed = await transaction.espacioParqueo.updateMany({
        where: {
          id: parkingSpace.id,
          activo: true,
          estado_id: availableState.id,
        },
        data: { estado_id: occupiedState.id },
      });
      if (claimed.count !== 1) {
        throw new UnprocessableEntityException(
          'El espacio fue asignado a otro vehículo y ya no está disponible.',
        );
      }

      return transaction.ticket.create({
        data: {
          vehiculo_id: vehicle.id,
          espacio_id: parkingSpace.id,
          empleado_ingreso_id: employee.id,
          hora_entrada: new Date(),
          estado: 'ACTIVO',
        },
        include: TICKET_RELATIONS,
      });
    });
  }

  async listar(): Promise<TicketWithRelations[]> {
    return this.prisma.ticket.findMany({
      where: { activo: true },
      include: TICKET_RELATIONS,
      orderBy: { hora_entrada: 'desc' },
    });
  }

  async buscarPorCodigo(codigoTicket: string): Promise<TicketWithRelations | null> {
    return this.prisma.ticket.findUnique({
      where: { codigo_ticket: codigoTicket },
      include: TICKET_RELATIONS,
    });
  }

  async actualizarSalida(id: number, horaSalida: Date): Promise<TicketWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const ticket = await transaction.ticket.findUnique({
        where: { id },
        include: TICKET_RELATIONS,
      });
      if (!ticket || ticket.estado !== 'ACTIVO') {
        throw new UnprocessableEntityException('El ticket ya fue cerrado o procesado.');
      }

      const states = await transaction.estadoEspacio.findMany({
        where: { activo: true },
      });
      const availableState = states.find((state) =>
        AVAILABLE_STATES.has(state.nombre.trim().toUpperCase()),
      );
      if (!availableState) {
        throw new InternalServerErrorException(
          'El catálogo no tiene un estado activo de espacio disponible.',
        );
      }

      const closed = await transaction.ticket.updateMany({
        where: { id, estado: 'ACTIVO' },
        data: { hora_salida: horaSalida, estado: 'FINALIZADO' },
      });
      if (closed.count !== 1) {
        throw new UnprocessableEntityException('El ticket ya fue cerrado o procesado.');
      }

      await transaction.espacioParqueo.update({
        where: { id: ticket.espacio_id },
        data: { estado_id: availableState.id },
      });

      return transaction.ticket.findUniqueOrThrow({
        where: { id },
        include: TICKET_RELATIONS,
      });
    });
  }

  async actualizar(codigoTicket: string, datos: any): Promise<any> {
    return this.prisma.ticket.update({
      where: { codigo_ticket: codigoTicket },
      data: datos,
    });
  }

  async eliminar(codigoTicket: string): Promise<any> {
    return this.prisma.ticket.update({
      where: { codigo_ticket: codigoTicket },
      data: { estado: 'INACTIVO', activo: false },
    });
  }
}
