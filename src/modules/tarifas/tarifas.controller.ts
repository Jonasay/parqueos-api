import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TarifasService } from './tarifas.service.js';
import { CrearTarifaDto } from './dto/crear-tarifa.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tarifas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Post()
  @ApiOperation({ summary: 'Configura una nueva tarifa para un tipo de vehículo' })
  @ApiResponse({ status: 201, description: 'Tarifa registrada exitosamente.' })
  @ApiResponse({ status: 422, description: 'Ya existe una tarifa activa para este vehículo.' })
  async registrar(@Body() crearTarifaDto: CrearTarifaDto) {
    return this.tarifasService.registrarTarifa(crearTarifaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas las tarifas configuradas' })
  async obtenerTodas() {
    return this.tarifasService.obtenerTarifas();
  }

  @Get('vehiculo/:id')
  @ApiOperation({ summary: 'Busca la tarifa activa por ID de tipo de vehículo' })
  async buscarPorTipoVehiculo(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.buscarTarifaActiva(id);
  }
}