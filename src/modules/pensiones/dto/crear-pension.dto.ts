import { IsInt, IsNotEmpty, IsDateString, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CrearPensionDto {
  @ApiProperty({ description: 'ID del cliente titular de la pensión', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  cliente_id: number;

  @ApiProperty({ description: 'ID del vehículo asociado a la pensión', example: 5 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  vehiculo_id: number;

  @ApiProperty({ description: 'ID de la tarifa o plan mensual aplicado', example: 3 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  tarifa_id: number;

  @ApiProperty({ description: 'Fecha de inicio de la pensión (ISO 8601)', example: '2026-11-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @ApiProperty({ description: 'Fecha de finalización de la pensión', example: '2026-11-30T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  fecha_fin: string;
}

export class ActualizarPensionDto extends PartialType(CrearPensionDto) {}

