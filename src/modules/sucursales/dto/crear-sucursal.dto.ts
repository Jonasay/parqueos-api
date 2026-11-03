import { IsString, IsNotEmpty, IsInt, Min, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearSucursalDto {
  @ApiProperty({ description: 'Nombre comercial de la sucursal', example: 'Sucursal Centro Xela' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Dirección física de la sucursal', example: '4a Calle 12-30 Zona 1' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '7766-5544' })
  @IsString()
  @IsOptional()
  telefono_contacto?: string;

  @ApiProperty({ description: 'Capacidad máxima de vehículos permitidos', example: 150 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  capacidad_maxima: number;
}