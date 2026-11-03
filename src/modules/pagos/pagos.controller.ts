import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service.js';
import { CrearPagoDto } from './dto/crear-pago.dto.js';
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
}