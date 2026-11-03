import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearTipoVehiculoDto {
  @ApiProperty({ description: 'Nombre del tipo de vehículo', example: 'Sedán' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}