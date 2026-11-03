import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SucursalesService } from './sucursales.service.js';
import { CrearSucursalDto } from './dto/crear-sucursal.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sucursales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('api/sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  @ApiOperation({ summary: 'Registra una nueva sucursal del parqueo' })
  @ApiResponse({ status: 201, description: 'Sucursal creada exitosamente.' })
  @ApiResponse({ status: 422, description: 'El nombre de la sucursal ya existe.' })
  async registrar(@Body() crearSucursalDto: CrearSucursalDto) {
    return this.sucursalesService.registrarSucursal(crearSucursalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas las sucursales con sus niveles asociados' })
  async obtenerTodas() {
    return this.sucursalesService.obtenerSucursales();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca una sucursal específica por su ID' })
  @ApiResponse({ status: 200, description: 'Sucursal encontrada.' })
  @ApiResponse({ status: 404, description: 'Sucursal no encontrada.' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalesService.buscarPorId(id);
  }
}
