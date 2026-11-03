import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearEstadoEspacioDto {
  @ApiProperty({ description: 'Nombre del estado del espacio', example: 'Ocupado' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}