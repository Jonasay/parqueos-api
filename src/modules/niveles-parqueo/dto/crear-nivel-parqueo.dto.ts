import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearNivelParqueoDto {
  @ApiProperty({ description: 'ID de la sucursal a la que pertenece el nivel', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  sucursal_id: number;

  @ApiProperty({ description: 'Nombre o identificador del nivel', example: 'Sótano 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_nivel: string;
}