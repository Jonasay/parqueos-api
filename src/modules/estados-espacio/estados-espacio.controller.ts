import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EstadosEspacioService } from './estados-espacio.service.js';
import { CrearEstadoEspacioDto } from './dto/crear-estado-espacio.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Catálogo: Estados de Espacio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Blindaje total de seguridad
@Controller('api/estados-espacio')
export class EstadosEspacioController {
  constructor(private readonly estadosEspacioService: EstadosEspacioService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo estado para los espacios de parqueo' })
  @ApiResponse({ status: 201, description: 'Estado registrado.' })
  @ApiResponse({ status: 422, description: 'El estado ya existe.' })
  async registrar(@Body() crearEstadoEspacioDto: CrearEstadoEspacioDto) {
    return this.estadosEspacioService.registrarEstado(crearEstadoEspacioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los estados posibles' })
  async obtenerTodos() {
    return this.estadosEspacioService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca un estado de espacio por su ID' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.estadosEspacioService.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un estado de espacio por su ID' })
  @ApiResponse({ status: 200, description: 'Estado eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.estadosEspacioService.eliminarEstado(id);
  }
}