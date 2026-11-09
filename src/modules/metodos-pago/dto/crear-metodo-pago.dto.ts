import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CrearMetodoPagoDto {
  @ApiProperty({ description: 'Nombre del método de pago', example: 'Tarjeta de Crédito' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}

export class ActualizarMetodoPagoDto extends PartialType(CrearMetodoPagoDto) {}
