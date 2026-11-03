import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller.js';
import { PagosService } from './pagos.service.js';
import {PrismaPagosRepository} from './repositories/prisma-pagos.repository.js';  
import { PAGOS_REPOSITORY } from './repositories/pagos.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [PagosController],
  providers: [
    PagosService,
    {
      provide: PAGOS_REPOSITORY,
      useClass: PrismaPagosRepository
    },
    JwtStrategy,
  ]
})
export class PagosModule {}





