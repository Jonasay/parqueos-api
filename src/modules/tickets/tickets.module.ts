import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';
import { PrismaTicketsRepository } from './repositories/prisma-tickets.repository.js';
import { TICKETS_REPOSITORY } from './repositories/tickets.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    {
      provide: TICKETS_REPOSITORY,
      useClass: PrismaTicketsRepository,
    },
    JwtStrategy,
  ],
})
export class TicketsModule {}