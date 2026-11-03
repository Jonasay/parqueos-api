import { Module } from '@nestjs/common';
import { TarifasController } from './tarifas.controller.js';
import { TarifasService } from './tarifas.service.js';
import { PrismaTarifasRepository } from './repositories/prisma-tarifas.repository.js';
import { TARIFAS_REPOSITORY } from './repositories/tarifas.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [TarifasController],
  providers: [
    TarifasService,
    {
      provide: TARIFAS_REPOSITORY,
      useClass: PrismaTarifasRepository
    },
    JwtStrategy,
  ]
})
export class TarifasModule {}
