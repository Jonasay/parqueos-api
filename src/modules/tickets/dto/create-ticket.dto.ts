import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ description: 'ID del vehículo que ingresa', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ description: 'ID del espacio de parqueo asignado', example: 5 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  espacioId: number;

  @ApiProperty({ description: 'ID del empleado en turno', example: 2 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  empleadoId: number;
}

export class ActualizarTicketDto extends PartialType(CreateTicketDto) {}
