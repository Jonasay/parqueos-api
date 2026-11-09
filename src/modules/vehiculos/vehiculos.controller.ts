import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service.js';
import { CrearVehiculoDto, ActualizarVehiculoDto } from './dto/crear-vehiculo.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Vehículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('api/vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo vehículo' })
  @ApiResponse({ status: 201, description: 'Vehículo registrado.' })
  @ApiResponse({ status: 422, description: 'La placa ya existe.' })
  async registrar(@Body() crearVehiculoDto: CrearVehiculoDto) {
    return this.vehiculosService.registrarVehiculo(crearVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los vehículos registrados' })
  async obtenerTodos() {
    return this.vehiculosService.obtenerTodos();
  }

  @Get(':placa')
  @ApiOperation({ summary: 'Busca un vehículo por su placa' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado.' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  async buscarPorPlaca(@Param('placa') placa: string) {
    return this.vehiculosService.buscarPorPlaca(placa);
  }

  @Put(':placa')
  @ApiOperation({ summary: 'Actualiza un vehículo por su placa' })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  async actualizar(
    @Param('placa') placa: string,
    @Body() actualizarVehiculoDto: ActualizarVehiculoDto,
  ) {
    return this.vehiculosService.actualizarVehiculo(placa, actualizarVehiculoDto);
  }

  @Delete(':placa')
  @ApiOperation({ summary: 'Elimina lógicamente un vehículo por su placa' })
  @ApiResponse({ status: 200, description: 'Vehículo archivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  async eliminar(@Param('placa') placa: string) {
    return this.vehiculosService.eliminarVehiculo(placa);
  }
}
