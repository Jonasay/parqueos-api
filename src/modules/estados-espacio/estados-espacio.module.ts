import { Module } from '@nestjs/common';
import { EstadosEspacioController } from './estados-espacio.controller.js';
import { EstadosEspacioService } from './estados-espacio.service.js';
import { PrismaEstadosEspacioRepository } from './repositories/prisma-estados-espacio.repository.js';
import { ESTADOS_ESPACIO_REPOSITORY } from './repositories/estados-espacio.repository.interface.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [EstadosEspacioController],
  providers: [
    EstadosEspacioService,
    { provide: ESTADOS_ESPACIO_REPOSITORY, 
      useClass: PrismaEstadosEspacioRepository 

    },
    JwtAuthGuard,
  ]
})
export class EstadosEspacioModule {}
