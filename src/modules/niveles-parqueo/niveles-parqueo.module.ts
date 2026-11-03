import { Module } from '@nestjs/common';
import { NivelesParqueoController } from './niveles-parqueo.controller.js';
import { NivelesParqueoService } from './niveles-parqueo.service.js';
import { PrismaNivelesParqueoRepository } from './repositories/prisma-niveles-parqueo.repository.js';
import { NIVELES_PARQUEO_REPOSITORY } from './repositories/niveles-parqueo.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import {JwtStrategy} from "../auth/jwt.strategy.js";

@Module({
  imports: [PrismaModule],
  controllers: [NivelesParqueoController],
  providers: [
    NivelesParqueoService,
    {
      provide: NIVELES_PARQUEO_REPOSITORY,
      useClass: PrismaNivelesParqueoRepository
    },
    JwtStrategy,
  ]
})
export class NivelesParqueoModule {}
