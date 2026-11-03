import { Module } from '@nestjs/common';
import { MetodosPagoController } from './metodos-pago.controller.js';
import { MetodosPagoService } from './metodos-pago.service.js';
import { PrismaMetodosPagoRepository } from './repositories/prisma-metodos-pago.repository.js';
import { METODOS_PAGO_REPOSITORY } from './repositories/metodos-pago.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import {JwtAuthGuard} from "../auth/jwt-auth.guard.js";

@Module({
  imports: [PrismaModule],
  controllers: [MetodosPagoController],
  providers: [
    MetodosPagoService,
    {
      provide: METODOS_PAGO_REPOSITORY,
      useClass: PrismaMetodosPagoRepository
    },
    JwtAuthGuard,
  ]
})
export class MetodosPagoModule {}
