import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service.js';
import { CrearMetodoPagoDto } from './dto/crear-metodo-pago.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Catálogo: Métodos de Pago')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('api/metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo método de pago' })
  @ApiResponse({ status: 201, description: 'Método de pago registrado.' })
  @ApiResponse({ status: 422, description: 'El método de pago ya existe.' })
  async registrar(@Body() crearMetodoPagoDto: CrearMetodoPagoDto) {
    return this.metodosPagoService.registrarMetodo(crearMetodoPagoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los métodos de pago disponibles' })
  async obtenerTodos() {
    return this.metodosPagoService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca un método de pago por su ID' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoService.buscarPorId(id);
  }
}