import { IsInt, IsBoolean, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CrearEspacioDto {
  @ApiProperty({ description: 'ID del nivel donde se ubica el espacio', example: 1 })
  @IsInt({ message: 'El nivel_id debe ser un número entero' })
  @Min(1)
  @IsNotEmpty()
  nivel_id: number;

  @ApiProperty({ description: 'ID del estado inicial (ej. 1 para Disponible)', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  estado_id: number;

  @ApiProperty({ description: 'ID del tipo de vehículo permitido (ej. 1 Sedán, 2 Moto)', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  tipo_vehiculo_id: number;

  @ApiProperty({ description: 'Indica si el espacio cuenta con techo', example: true })
  @IsBoolean({ message: 'es_techado debe ser un valor booleano' })
  @IsNotEmpty()
  es_techado: boolean;
}

export class ActualizarEspacioDto extends PartialType(CrearEspacioDto) {}
