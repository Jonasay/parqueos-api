import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Bloquea el acceso sin token
@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo usuario en el sistema' })
  @ApiResponse({ status: 201, description: 'Usuario registrado.' })
  @ApiResponse({ status: 422, description: 'El email ya existe.' })
  async registrar(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.registrarUsuario(crearUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los usuarios con sus roles y perfiles' })
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }
}