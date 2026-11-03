import { IsNumber, IsInt, IsNotEmpty, Min, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearTarifaDto {
  @ApiProperty({ description: 'ID del tipo de vehículo (ej. 1: Moto, 2: Sedán)', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  tipo_vehiculo_id: number;

  @ApiProperty({ description: 'Costo por hora completa', example: 15.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto_por_hora: number;

  @ApiProperty({ description: 'Costo por fracción de hora (ej. cada 15 min)', example: 5.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto_fraccion: number;

  @ApiPropertyOptional({ description: 'Indica si es la tarifa activa actualmente', example: true })
  @IsBoolean()
  @IsOptional()
  estado_activo?: boolean;
}