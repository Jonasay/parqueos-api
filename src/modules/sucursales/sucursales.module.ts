import { Module } from '@nestjs/common';
import { SucursalesController } from './sucursales.controller.js';
import { SucursalesService } from './sucursales.service.js';
import { PrismaSucursalesRepository } from './repositories/prisma-sucursales.repository.js';
import { SUCURSALES_REPOSITORY } from './repositories/sucursales.repository.interface.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SucursalesController],
  providers: [
    SucursalesService,
    { provide: SUCURSALES_REPOSITORY, 
      useClass: PrismaSucursalesRepository 
    },
    JwtStrategy,

  ]
  

})
export class SucursalesModule {}
