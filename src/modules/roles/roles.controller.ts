import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { CrearRolDto } from './dto/crear-rol.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Catálogo: Roles de Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un nuevo rol en el sistema' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente.' })
  @ApiResponse({ status: 422, description: 'El rol ya existe.' })
  async registrar(@Body() crearRolDto: CrearRolDto) {
    return this.rolesService.registrarRol(crearRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los roles configurados' })
  async obtenerTodos() {
    return this.rolesService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca un rol específico por su ID' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un rol por su ID' })
  @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.eliminarRol(id);
  }
}
