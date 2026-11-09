import { IsInt, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CrearPagoDto {
  @ApiProperty({ description: 'ID del ticket a pagar', example: 1 })
  @IsInt()
  @Min(1)
  ticket_id: number;

  @ApiProperty({ description: 'Monto total pagado', example: 25.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  total_pagado: number;

  @ApiProperty({ description: 'ID del método de pago (ej. 1: Efectivo, 2: Tarjeta)', example: 1 })
  @IsInt()
  @Min(1)
  metodo_pago_id: number;

  @ApiPropertyOptional({ description: 'Número de autorización (solo tarjetas)', example: 'AUTH-9923' })
  @IsOptional()
  numero_autorizacion?: string;

  @ApiPropertyOptional({ description: 'Requiere Factura Electrónica (FEL)', example: false })
  @IsBoolean()
  @IsOptional()
  requiere_fel?: boolean;
}

export class ActualizarPagoDto extends PartialType(CrearPagoDto) {}
