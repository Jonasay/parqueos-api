import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EspaciosService } from './espacios.service.js';
import { CrearEspacioDto, ActualizarEspacioDto } from './dto/crear-espacio.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Espacios')
@ApiBearerAuth() // Habilita el candado de autorización en Swagger
@UseGuards(JwtAuthGuard) // Garantiza que ningún endpoint sea accesible sin token[cite: 7, 8]
@Controller('api/espacios')
export class EspaciosController {
  constructor(private readonly espaciosService: EspaciosService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo espacio de parqueo' })
  @ApiResponse({ status: 201, description: 'Espacio creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Estructura JSON inválida (DTO).' })
  @ApiResponse({ status: 401, description: 'Token JWT faltante o inválido.' })
  async crear(@Body() crearEspacioDto: CrearEspacioDto) {
    return this.espaciosService.crearEspacio(crearEspacioDto);
  }

  @Get('disponibles')
  @ApiOperation({ summary: 'Lista todos los espacios actualmente disponibles' })
  @ApiResponse({ status: 200, description: 'Lista obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'Acceso no autorizado.' })
  async obtenerDisponibles() {
    return this.espaciosService.consultarDisponibles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene el detalle de un espacio por su ID' })
  @ApiResponse({ status: 200, description: 'Espacio encontrado.' })
  @ApiResponse({ status: 404, description: 'El espacio solicitado no existe.' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.espaciosService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza un espacio de parqueo por su ID' })
  @ApiResponse({ status: 200, description: 'Espacio actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'El espacio solicitado no existe.' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarEspacioDto: ActualizarEspacioDto,
  ) {
    return this.espaciosService.actualizarEspacio(id, actualizarEspacioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un espacio de parqueo por su ID' })
  @ApiResponse({ status: 200, description: 'Espacio eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'El espacio solicitado no existe.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.espaciosService.eliminarEspacio(id);
  }
}