import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const secret = process.env.JWT_SECRET || 'Parqueo_JWT_Secret_2026_Key_Ultra_Segura_UMES';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: {
    id?: number | string;
    sub?: number | string;
    usuario_id?: number | string;
    email?: string;
    correo?: string;
    nombre?: string;
    apellido?: string;
    rol?: number | string;
    rol_id?: number | string;
  }) {
    const externalId = payload.id ?? payload.sub ?? payload.usuario_id;
    if (externalId === undefined || externalId === null || String(externalId).trim() === '') {
      throw new UnauthorizedException('El token no contiene un identificador de usuario válido.');
    }

    let user = await this.prisma.usuario.findUnique({
      where: { external_auth_id: String(externalId) },
    });

    if (!user) {
      const email = (payload.correo || payload.email || '').trim().toLowerCase();
      const roleId = Number(payload.rol ?? payload.rol_id ?? 2) || 2;

      if (email && this.prisma.usuario?.update && this.prisma.usuario?.create) {
        const existingByEmail = await this.prisma.usuario.findUnique({ where: { email } });
        if (existingByEmail) {
          user = await this.prisma.usuario.update({
            where: { id: existingByEmail.id },
            data: { external_auth_id: String(externalId) },
          });
        } else if (this.prisma.rol?.findUnique) {
          let role = await this.prisma.rol.findUnique({ where: { id: roleId } });
          if (!role && (this.prisma.rol as any)?.create) {
            role = await (this.prisma.rol as any)
              .create({
                data: {
                  id: roleId,
                  nombre: roleId === 1 ? 'ADMIN' : `ROL_${roleId}`,
                  activo: true,
                },
              })
              .catch(() => null);
          }
          if (role) {
            user = await this.prisma.usuario.create({
              data: {
                email,
                nombre: payload.nombre?.trim() || null,
                apellido: payload.apellido?.trim() || null,
                external_auth_id: String(externalId),
                password_hash: null,
                estado: 'ACTIVO',
                rol_id: roleId,
              },
            });
          }
        }
      }
    }

    if (!user || !user.activo || user.estado !== 'ACTIVO') {
      throw new UnauthorizedException('La identidad autenticada no está sincronizada o está inactiva.');
    }

    return { usuarioId: user.id, email: user.email };
  }
}