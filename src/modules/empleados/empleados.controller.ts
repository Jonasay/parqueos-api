import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EmpleadosService } from './empleados.service.js';
import { CrearEmpleadoDto } from './dto/crear-empleado.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Empleados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo empleado operativo' })
  @ApiResponse({ status: 201, description: 'Empleado registrado exitosamente.' })
  @ApiResponse({ status: 422, description: 'Usuario o DPI ya registrados.' })
  async registrar(@Body() crearEmpleadoDto: CrearEmpleadoDto) {
    return this.empleadosService.registrarEmpleado(crearEmpleadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los empleados' })
  async obtenerTodos() {
    return this.empleadosService.obtenerTodos();
  }

  @Get(':dpi')
  @ApiOperation({ summary: 'Busca un empleado mediante su DPI' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado.' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  async buscarPorDpi(@Param('dpi') dpi: string) {
    return this.empleadosService.buscarPorDpi(dpi);
  }
}