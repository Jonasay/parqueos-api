import { Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller.js';
import { ClientesService } from './clientes.service.js';
import { PrismaClientesRepository } from './repositories/prisma-clientes.repository.js';
import { CLIENTES_REPOSITORY } from './repositories/clientes.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';   
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [ClientesController],
  providers: [
    ClientesService,
    {
      provide: CLIENTES_REPOSITORY,
      useClass: PrismaClientesRepository
    },
    JwtStrategy,
  ],
 
})
export class ClientesModule {}
