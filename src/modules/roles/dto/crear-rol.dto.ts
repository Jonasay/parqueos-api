import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearRolDto {
  @ApiProperty({ description: 'Nombre del rol en el sistema', example: 'Administrador' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}