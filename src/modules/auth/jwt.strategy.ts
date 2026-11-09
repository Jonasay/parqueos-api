import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Falta configurar JWT_SECRET.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: { id?: number | string; email?: string }) {
    const externalId = payload.id;
    if (externalId === undefined || externalId === null || String(externalId).trim() === '') {
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