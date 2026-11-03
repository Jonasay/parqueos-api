import { Module } from '@nestjs/common';
import { TiposVehiculoController } from './tipos-vehiculo.controller.js';
import { TiposVehiculoService } from './tipos-vehiculo.service.js';
import { PrismaTiposVehiculoRepository } from './repositories/prisma-tipos-vehiculo.repository.js';
import { TIPOS_VEHICULO_REPOSITORY } from './repositories/tipos-vehiculo.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [TiposVehiculoController],
  providers: [
    TiposVehiculoService,
    {
      provide: TIPOS_VEHICULO_REPOSITORY,
      useClass: PrismaTiposVehiculoRepository
    },
    JwtStrategy,
  ]
})
export class TiposVehiculoModule {}
