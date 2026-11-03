import { Module } from '@nestjs/common';
import { EspaciosController } from './espacios.controller.js';
import { EspaciosService } from './espacios.service.js';
import { PrismaEspaciosRepository } from './repositories/prisma-espacios.repository.js';
import { ESPACIOS_REPOSITORY } from './repositories/espacios.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';      

@Module({
  imports: [PrismaModule],
  controllers: [EspaciosController],
  providers: [
    EspaciosService,
    {
      provide: ESPACIOS_REPOSITORY,
      useClass: PrismaEspaciosRepository
    },
    JwtStrategy,
  ],

})
export class EspaciosModule {}
