import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { CrearClienteDto } from './dto/crear-cliente.dto.js';
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
}
