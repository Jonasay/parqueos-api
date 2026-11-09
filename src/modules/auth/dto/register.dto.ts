import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Correo de la cuenta', example: 'operador@example.test' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ description: 'Contraseña para el servicio de autenticación' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ description: 'Nombres del usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombres?: string;

  @ApiPropertyOptional({ description: 'Apellidos del usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellidos?: string;
}
