import { Module } from '@nestjs/common';
import { VehiculosController } from './vehiculos.controller.js';
import { VehiculosService } from './vehiculos.service.js';
import { PrismaVehiculosRepository } from './repositories/prisma-vehiculos.repository.js';
import { VEHICULOS_REPOSITORY } from './repositories/vehiculos.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [VehiculosController],
  providers: [
    VehiculosService,
    {
      provide: VEHICULOS_REPOSITORY,
      useClass: PrismaVehiculosRepository
    },
    JwtStrategy,
  ],
})
export class VehiculosModule {}


