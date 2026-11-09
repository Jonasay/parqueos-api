import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { CrearClienteDto, ActualizarClienteDto } from './dto/crear-cliente.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado.' })
  @ApiResponse({ status: 422, description: 'El usuario ya es cliente.' })
  async registrar(@Body() crearClienteDto: CrearClienteDto) {
    return this.clientesService.registrarCliente(crearClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los clientes' })
  async obtenerTodos() {
    return this.clientesService.obtenerTodos();
  }

  @Get(':usuarioId')
  @ApiOperation({ summary: 'Busca un cliente por su ID de usuario' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async buscarPorUsuarioId(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.clientesService.buscarPorUsuarioId(usuarioId);
  }

  @Put(':usuarioId')
  @ApiOperation({ summary: 'Actualiza un cliente por su ID de usuario' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async actualizar(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() actualizarClienteDto: ActualizarClienteDto,
  ) {
    return this.clientesService.actualizarCliente(usuarioId, actualizarClienteDto);
  }

  @Delete(':usuarioId')
  @ApiOperation({ summary: 'Elimina lógicamente un cliente por su ID de usuario' })
  @ApiResponse({ status: 200, description: 'Cliente archivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async eliminar(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.clientesService.eliminarCliente(usuarioId);
  }
}
