import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearUsuarioDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'operador@umes.edu.gt' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Hash de la contraseña (generado externamente)', example: '$2b$10$xyz...' })
  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @ApiProperty({ description: 'ID del rol asignado', example: 2 })
  @IsInt()
  @Min(1)
  rol_id: number;
}