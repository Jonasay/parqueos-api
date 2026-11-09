import { IsString, IsInt, IsOptional, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CrearClienteDto {
  @ApiProperty({ description: 'ID del usuario asociado', example: 1 })
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @ApiPropertyOptional({ description: 'NIT para facturación', example: '123456-7' })
  @IsString()
  @IsOptional()
  @Length(5, 30)
  nit_facturacion?: string;

  @ApiPropertyOptional({ description: 'Nombre para facturación', example: 'Juan Pérez' })
  @IsString()
  @IsOptional()
  nombre_facturacion?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '5555-1234' })
  @IsString()
  @IsOptional()
  telefono?: string;
}

export class ActualizarClienteDto extends PartialType(CrearClienteDto) {}
