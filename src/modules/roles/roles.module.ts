import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller.js';
import { RolesService } from './roles.service.js';
import { PrismaRolesRepository } from './repositories/prisma-roles.repository.js';
import { ROLES_REPOSITORY } from './repositories/roles.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: ROLES_REPOSITORY,
      useClass: PrismaRolesRepository
    },
    JwtAuthGuard,
  ],
  
})
export class RolesModule {}
