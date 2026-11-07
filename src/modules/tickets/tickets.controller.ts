import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { TicketsService } from './tickets.service.js';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('entrada')
  @ApiOperation({ summary: 'Registra el ingreso de un vehículo' })
  @ApiResponse({ status: 201, description: 'Ticket generado exitosamente.' })
  @ApiResponse({ status: 422, description: 'Espacio no disponible.' })
  async registrarEntrada(
    @Body() body: { vehiculoId: number; espacioId: number; empleadoId: number },
  ) {
    return this.ticketsService.registrarEntrada(
      body.vehiculoId,
      body.espacioId,
      body.empleadoId,
    );
  }

  @Put('salida/:codigo')
  @ApiOperation({ summary: 'Registra la salida y calcula tarifa' })
  @ApiResponse({ status: 200, description: 'Salida procesada.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async registrarSalida(@Param('codigo') codigo: string) {
    return this.ticketsService.procesarSalida(codigo);
  }

  @Delete(':codigo')
  @ApiOperation({ summary: 'Elimina lógicamente un ticket por su código' })
  @ApiResponse({ status: 200, description: 'Ticket archivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async eliminar(@Param('codigo') codigo: string) {
    return this.ticketsService.eliminarTicket(codigo);
  }
}
