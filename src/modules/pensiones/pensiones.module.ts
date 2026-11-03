import { Module } from '@nestjs/common';
import { PensionesController } from './pensiones.controller.js';
import { PensionesService } from './pensiones.service.js';
import { PrismaPensionesRepository } from './repositories/prisma-pensiones.repository.js';
import { PENSIONES_REPOSITORY } from './repositories/pensiones.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [PensionesController],
  providers: [
    PensionesService,
    { provide: PENSIONES_REPOSITORY, 
      useClass: PrismaPensionesRepository 

    },
    JwtStrategy
  ]
})
export class PensionesModule {}
