import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKey: process.env.JWT_SECRET || 'LoginParqueo_2026_JVC_KEY', 
    });
  }

  async validate(payload: { id?: number | string; usuario_id?: number | string; email?: string }) {
    const externalId = payload.id ?? payload.usuario_id;
    if (externalId === undefined || externalId === null) {
      throw new UnauthorizedException('El token no contiene un identificador de usuario válido.');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { external_auth_id: String(externalId) },
    });
    if (!user || !user.activo || user.estado !== 'ACTIVO') {
      throw new UnauthorizedException('La identidad autenticada no está sincronizada o está inactiva.');
    }

    return { usuarioId: user.id, email: user.email };
  }
}