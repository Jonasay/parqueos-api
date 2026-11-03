import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearAuditLogDto {
  @ApiProperty({ description: 'ID del usuario que realiza la acción', example: 1 })
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @ApiProperty({ description: 'Acción realizada en el sistema', example: 'CREAR_TICKET' })
  @IsString()
  @IsNotEmpty()
  accion: string;

  @ApiPropertyOptional({ description: 'Detalles adicionales en formato JSON (string)', example: '{"ticket_id": 5}' })
  @IsString()
  @IsOptional()
  detalles?: string;
}