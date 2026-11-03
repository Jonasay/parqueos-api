import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller.js';
import { EmpleadosService } from './empleados.service.js';
import { PrismaEmpleadosRepository } from './repositories/prisma-empleados.repository.js';
import { EMPLEADOS_REPOSITORY } from './repositories/empleados.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [EmpleadosController],
  providers: [
    EmpleadosService,
    { provide: EMPLEADOS_REPOSITORY, 
    useClass: PrismaEmpleadosRepository 
  },
  JwtStrategy,
  ],
})
export class EmpleadosModule {}
