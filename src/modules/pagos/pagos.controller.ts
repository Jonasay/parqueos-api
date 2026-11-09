import { Controller, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PagosService } from './pagos.service.js';
import { CrearPagoDto, ActualizarPagoDto } from './dto/crear-pago.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pagos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Ningún endpoint debe ser accesible sin token[cite: 7, 8]
@Controller('api/pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @ApiOperation({ summary: 'Procesa el pago de un ticket de parqueo' })
  @ApiResponse({ status: 201, description: 'Pago registrado y ticket actualizado.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  @ApiResponse({ status: 422, description: 'Ticket ya pagado.' })
  async registrarPago(@Body() crearPagoDto: CrearPagoDto) {
    return this.pagosService.procesarPago(crearPagoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza un pago por su ID' })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarPagoDto: ActualizarPagoDto,
  ) {
    return this.pagosService.actualizarPago(id, actualizarPagoDto);
  }

  @Put('ticket/:ticketId')
  @ApiOperation({ summary: 'Actualiza el pago asociado a un ticket' })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async actualizarPorTicket(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() actualizarPagoDto: ActualizarPagoDto,
  ) {
    return this.pagosService.actualizarPagoPorTicket(ticketId, actualizarPagoDto);
  }

  @Delete('ticket/:ticketId')
  @ApiOperation({ summary: 'Elimina lógicamente el pago asociado a un ticket' })
  @ApiResponse({ status: 200, description: 'Pago archivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado.' })
  async eliminar(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.pagosService.eliminarPago(ticketId);
  }
}