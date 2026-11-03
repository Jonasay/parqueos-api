import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { PrismaUsuariosRepository } from './repositories/prisma-usuarios.repository.js';
import { USUARIOS_REPOSITORY } from './repositories/usuarios.repository.interface.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';

@Module({
  imports: [PrismaModule],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    {
      provide: USUARIOS_REPOSITORY,
      useClass: PrismaUsuariosRepository
    },
    JwtStrategy,
  ],
})
export class UsuariosModule {}
