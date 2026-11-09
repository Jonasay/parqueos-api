import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TarifasService } from './tarifas.service.js';
import { CrearTarifaDto, ActualizarTarifaDto } from './dto/crear-tarifa.dto.js';
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

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza una tarifa por su ID' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada.' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarTarifaDto: ActualizarTarifaDto,
  ) {
    return this.tarifasService.actualizarTarifa(id, actualizarTarifaDto);
  }

  @Put('vehiculo/:id')
  @ApiOperation({ summary: 'Actualiza la tarifa activa por ID de tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada.' })
  async actualizarPorTipoVehiculo(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarTarifaDto: ActualizarTarifaDto,
  ) {
    return this.tarifasService.actualizarTarifaPorTipoVehiculo(id, actualizarTarifaDto);
  }

  @Delete('vehiculo/:id')
  @ApiOperation({ summary: 'Elimina lógicamente la tarifa activa por ID de tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Tarifa archivada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.eliminarTarifa(id);
  }
}