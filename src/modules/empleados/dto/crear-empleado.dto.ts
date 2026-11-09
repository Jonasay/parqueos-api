import { IsString, IsInt, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CrearEmpleadoDto {
  @ApiProperty({ description: 'ID del usuario asignado a este empleado', example: 2 })
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @ApiProperty({ description: 'Nombres completos del empleado', example: 'Carlos Miguel' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ description: 'Apellidos completos del empleado', example: 'García' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ description: 'Documento Personal de Identificación (DPI)', example: '1234567890101' })
  @IsString()
  @Length(13, 13)
  @IsNotEmpty()
  dpi: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '4455-6677' })
  @IsString()
  @IsOptional()
  telefono?: string;
}

export class ActualizarEmpleadoDto extends PartialType(CrearEmpleadoDto) {}
