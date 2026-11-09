import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';

export class RegistrarEntradaTicketDto {
  @ApiPropertyOptional({ description: 'ID del vehículo (usar vehiculoId o vehiculo_id)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehiculoId?: number;

  @ApiPropertyOptional({ description: 'ID del vehículo (usar vehiculoId o vehiculo_id)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehiculo_id?: number;

  @ApiPropertyOptional({ description: 'Placa del vehículo, alternativa a enviar el ID', example: 'P-123ABC' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  placa?: string;

  @ApiPropertyOptional({ description: 'ID del espacio (usar espacioId o espacio_id)', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  espacioId?: number;

  @ApiPropertyOptional({ description: 'ID del espacio (usar espacioId o espacio_id)', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  espacio_id?: number;

  @ApiPropertyOptional({ description: 'ID del empleado (usar empleadoId o empleado_ingreso_id)', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empleadoId?: number;

  @ApiPropertyOptional({ description: 'ID del empleado (usar empleadoId o empleado_ingreso_id)', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empleado_ingreso_id?: number;
}
