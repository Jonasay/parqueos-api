import { Module } from '@nestjs/common';
import { AuditLogsController } from './audit-logs.controller.js';
import { AuditLogsService } from './audit-logs.service.js';
import { PrismaAuditLogsRepository } from './repositories/prisma-audit-logs.repository.js';
import { AUDIT_LOGS_REPOSITORY } from './repositories/audit-logs.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogsController],
  providers: [
    AuditLogsService,
    {
      provide: AUDIT_LOGS_REPOSITORY,
      useClass: PrismaAuditLogsRepository
    },
    JwtStrategy,
  ]
})
export class AuditLogsModule {}
