import { IsString, IsInt, IsOptional, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CrearVehiculoDto {
  @ApiProperty({ description: 'Placa del vehículo', example: 'P123ABC' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  placa: string;

  @ApiPropertyOptional({ description: 'Color del vehículo', example: 'Rojo' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Marca del vehículo', example: 'Toyota' })
  @IsString()
  @IsOptional()
  marca?: string;

  @ApiPropertyOptional({ description: 'ID del cliente propietario', example: 1 })
  @IsInt()
  @IsOptional()
  cliente_id?: number;
}

export class ActualizarVehiculoDto extends PartialType(CrearVehiculoDto) {}
