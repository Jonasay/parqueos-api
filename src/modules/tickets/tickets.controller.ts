import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { TicketsService } from './tickets.service.js';
import { ActualizarTicketDto } from './dto/create-ticket.dto.js';
import { RegistrarEntradaTicketDto } from './dto/registrar-entrada-ticket.dto.js';

interface AuthenticatedRequest extends Request {
  user: { usuarioId: number };
}

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista tickets para Caja' })
  @ApiResponse({ status: 200, description: 'Tickets con codigo, placa, espacio y horarios.' })
  async listar() {
    return this.ticketsService.listar();
  }

  @Post('entrada')
  @ApiOperation({ summary: 'Registra el ingreso de un vehículo' })
  @ApiBody({ type: RegistrarEntradaTicketDto })
  @ApiResponse({ status: 201, description: 'Ticket generado exitosamente.' })
  @ApiResponse({ status: 422, description: 'Espacio no disponible.' })
  async registrarEntrada(
    @Body() body: RegistrarEntradaTicketDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const vehiculoId = body.vehiculoId ?? body.vehiculo_id;
    const espacioId = body.espacioId ?? body.espacio_id;

    if (vehiculoId === undefined && !body.placa) {
      throw new BadRequestException('Debe enviar vehiculoId, vehiculo_id o placa.');
    }
    if (espacioId === undefined) {
      throw new BadRequestException('Debe enviar espacioId o espacio_id.');
    }

    return this.ticketsService.registrarEntrada({
      vehiculoId,
      placa: body.placa,
      espacioId,
      usuarioId: request.user.usuarioId,
    });
  }

  @Put('salida/:codigo')
  @ApiOperation({ summary: 'Registra la salida y calcula tarifa' })
  @ApiResponse({ status: 200, description: 'Salida procesada.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async registrarSalida(@Param('codigo') codigo: string) {
    return this.ticketsService.procesarSalida(codigo);
  }

  @Put(':codigo')
  @ApiOperation({ summary: 'Actualiza un ticket por su código' })
  @ApiResponse({ status: 200, description: 'Ticket actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async actualizar(
    @Param('codigo') codigo: string,
    @Body() actualizarTicketDto: ActualizarTicketDto,
  ) {
    return this.ticketsService.actualizarTicket(codigo, actualizarTicketDto);
  }

  @Delete(':codigo')
  @ApiOperation({ summary: 'Elimina lógicamente un ticket por su código' })
  @ApiResponse({ status: 200, description: 'Ticket archivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async eliminar(@Param('codigo') codigo: string) {
    return this.ticketsService.eliminarTicket(codigo);
  }
}
