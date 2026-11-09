import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, ValidateIf } from 'class-validator';

export class RegistrarEntradaTicketDto {
  @ApiPropertyOptional({ description: 'ID del vehículo (usar vehiculoId o vehiculo_id)', example: 1 })
  @ValidateIf((dto: RegistrarEntradaTicketDto) => dto.vehiculo_id === undefined)
  @IsInt()
  @Min(1)
  vehiculoId: number;

  @ApiPropertyOptional({ description: 'ID del vehículo (usar vehiculoId o vehiculo_id)', example: 1 })
  @ValidateIf((dto: RegistrarEntradaTicketDto) => dto.vehiculoId === undefined)
  @IsInt()
  @Min(1)
  vehiculo_id?: number;

  @ApiPropertyOptional({ description: 'ID del espacio (usar espacioId o espacio_id)', example: 5 })
  @ValidateIf((dto: RegistrarEntradaTicketDto) => dto.espacio_id === undefined)
  @IsInt()
  @Min(1)
  espacioId: number;

  @ApiPropertyOptional({ description: 'ID del espacio (usar espacioId o espacio_id)', example: 5 })
  @ValidateIf((dto: RegistrarEntradaTicketDto) => dto.espacioId === undefined)
  @IsInt()
  @Min(1)
  espacio_id?: number;

  @ApiPropertyOptional({ description: 'ID del empleado (usar empleadoId o empleado_ingreso_id)', example: 2 })
  @ValidateIf((dto: RegistrarEntradaTicketDto) => dto.empleado_ingreso_id === undefined)
  @IsInt()
  @Min(1)
  empleadoId: number;

  @ApiPropertyOptional({ description: 'ID del empleado (usar empleadoId o empleado_ingreso_id)', example: 2 })
  @ValidateIf((dto: RegistrarEntradaTicketDto) => dto.empleadoId === undefined)
  @IsInt()
  @Min(1)
  empleado_ingreso_id?: number;
}
