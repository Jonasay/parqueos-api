import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NivelesParqueoService } from './niveles-parqueo.service.js';
import { CrearNivelParqueoDto, ActualizarNivelParqueoDto } from './dto/crear-nivel-parqueo.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Niveles de Parqueo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('api/niveles-parqueo')
export class NivelesParqueoController {
  constructor(private readonly nivelesParqueoService: NivelesParqueoService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo nivel dentro de una sucursal' })
  @ApiResponse({ status: 201, description: 'Nivel creado exitosamente.' })
  @ApiResponse({ status: 422, description: 'El nivel ya existe en esta sucursal.' })
  async registrar(@Body() crearNivelParqueoDto: CrearNivelParqueoDto) {
    return this.nivelesParqueoService.registrarNivel(crearNivelParqueoDto);
  }

  @Get('sucursal/:sucursalId')
  @ApiOperation({ summary: 'Lista todos los niveles pertenecientes a una sucursal' })
  async obtenerPorSucursal(@Param('sucursalId', ParseIntPipe) sucursalId: number) {
    return this.nivelesParqueoService.obtenerPorSucursal(sucursalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca un nivel específico por su ID' })
  @ApiResponse({ status: 200, description: 'Nivel encontrado.' })
  @ApiResponse({ status: 404, description: 'Nivel no encontrado.' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.nivelesParqueoService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza un nivel de parqueo por su ID' })
  @ApiResponse({ status: 200, description: 'Nivel actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Nivel no encontrado.' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarNivelParqueoDto: ActualizarNivelParqueoDto,
  ) {
    return this.nivelesParqueoService.actualizarNivel(id, actualizarNivelParqueoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un nivel de parqueo por su ID' })
  @ApiResponse({ status: 200, description: 'Nivel eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Nivel no encontrado.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.nivelesParqueoService.eliminarNivel(id);
  }
}