import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PensionesService } from './pensiones.service.js';
import { CrearPensionDto } from './dto/crear-pension.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pensiones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('api/pensiones')
export class PensionesController {
  constructor(private readonly pensionesService: PensionesService) {}

  @Post()
  @ApiOperation({ summary: 'Registra una nueva pensión para un vehículo' })
  @ApiResponse({ status: 201, description: 'Pensión creada exitosamente.' })
  @ApiResponse({ status: 422, description: 'El vehículo ya tiene una pensión activa.' })
  async registrar(@Body() crearPensionDto: CrearPensionDto) {
    return this.pensionesService.registrarPension(crearPensionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas las pensiones registradas' })
  async obtenerTodas() {
    return this.pensionesService.obtenerTodas();
  }

  @Get('vehiculo/:id/acceso')
  @ApiOperation({ summary: 'Verifica si un vehículo tiene acceso permitido por pensión' })
  @ApiResponse({ status: 200, description: 'Pensión activa encontrada.' })
  @ApiResponse({ status: 404, description: 'Sin pensión activa.' })
  async verificarAcceso(@Param('id', ParseIntPipe) id: number) {
    return this.pensionesService.verificarAcceso(id);
  }

  @Delete('vehiculo/:id')
  @ApiOperation({ summary: 'Elimina lógicamente la pensión activa de un vehículo' })
  @ApiResponse({ status: 200, description: 'Pensión archivada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pensión activa no encontrada.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.pensionesService.eliminarPension(id);
  }
}