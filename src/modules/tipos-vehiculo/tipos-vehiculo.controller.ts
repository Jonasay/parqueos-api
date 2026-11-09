import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TiposVehiculoService } from './tipos-vehiculo.service.js';
import { CrearTipoVehiculoDto, ActualizarTipoVehiculoDto } from './dto/crear-tipo-vehiculo.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Catálogo: Tipos de Vehículo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tipos-vehiculo')
export class TiposVehiculoController {
  constructor(private readonly tiposVehiculoService: TiposVehiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo tipo de vehículo' })
  @ApiResponse({ status: 201, description: 'Tipo de vehículo creado.' })
  @ApiResponse({ status: 422, description: 'El tipo de vehículo ya existe.' })
  async registrar(@Body() crearTipoVehiculoDto: CrearTipoVehiculoDto) {
    return this.tiposVehiculoService.registrarTipo(crearTipoVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los tipos de vehículos' })
  async obtenerTodos() {
    return this.tiposVehiculoService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca un tipo de vehículo por su ID' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo encontrado.' })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado.' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tiposVehiculoService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza un tipo de vehículo por su ID' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado.' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarTipoVehiculoDto: ActualizarTipoVehiculoDto,
  ) {
    return this.tiposVehiculoService.actualizarTipo(id, actualizarTipoVehiculoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un tipo de vehículo por su ID' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.tiposVehiculoService.eliminarTipo(id);
  }
}
