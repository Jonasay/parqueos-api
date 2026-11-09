import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EmpleadosService } from './empleados.service.js';
import { CrearEmpleadoDto, ActualizarEmpleadoDto } from './dto/crear-empleado.dto.js';
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

  @Put(':usuarioId')
  @ApiOperation({ summary: 'Actualiza un empleado por su ID de usuario' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  async actualizar(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() actualizarEmpleadoDto: ActualizarEmpleadoDto,
  ) {
    return this.empleadosService.actualizarEmpleado(usuarioId, actualizarEmpleadoDto);
  }

  @Delete(':usuarioId')
  @ApiOperation({ summary: 'Elimina lógicamente un empleado por su ID de usuario' })
  @ApiResponse({ status: 200, description: 'Empleado archivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  async eliminar(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.empleadosService.eliminarEmpleado(usuarioId);
  }
}