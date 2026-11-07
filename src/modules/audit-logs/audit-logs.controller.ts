import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service.js';
import { CrearAuditLogDto } from './dto/crear-audit-log.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auditoría')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Registra una nueva acción en la bitácora' })
  async registrar(@Body() crearAuditLogDto: CrearAuditLogDto) {
    return this.auditLogsService.registrarAccion(crearAuditLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todo el historial de auditoría' })
  async obtenerHistorial() {
    return this.auditLogsService.obtenerHistorial();
  }

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Filtra la bitácora por ID de usuario' })
  async buscarPorUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogsService.obtenerHistorialPorUsuario(id);
  }

  @Delete('usuario/:id')
  @ApiOperation({ summary: 'Elimina lógicamente los registros de auditoría por ID de usuario' })
  @ApiResponse({ status: 200, description: 'Registros archivados exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registros no encontrados.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogsService.eliminarLog(id);
  }
}
