import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
  BadGatewayException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Prisma } from '@prisma/client';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { lastValueFrom } from 'rxjs';
import { isAxiosError } from 'axios';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';

interface ExternalAuthUser {
  id: number | string;
  correo: string;
  rol: number | string;
  activo?: boolean;
  estado?: string;
}

interface ExternalAuthResponse {
  ok?: boolean;
  mensaje?: string;
  usuario?: ExternalAuthUser;
  token?: string;
  access_token?: string;
  jwt?: string;
}

interface NormalizedExternalUser {
  externalId: string;
  email: string;
  roleId: number;
  active?: boolean;
  state?: 'ACTIVO' | 'INACTIVO';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async loginProxy(credentials: LoginDto) {
    let response: ExternalAuthResponse;
    try {
      const result = await lastValueFrom(
        this.httpService.post<ExternalAuthResponse>(
          `${this.getExternalApiBaseUrl()}/api/login`,
          { correo: credentials.email.trim().toLowerCase(), password: credentials.password },
          { headers: this.getExternalApiHeaders() },
        ),
      );
      response = result.data;
    } catch (error) {
      this.throwExternalError(error, 'No fue posible validar las credenciales.');
    }

    if (!response?.ok || !response.usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const externalUser = this.normalizeExternalUser(response.usuario);
    const token = response.token ?? response.access_token ?? response.jwt;
    if (typeof token !== 'string' || !token) {
      throw new BadGatewayException('La API externa no devolvió un token de acceso.');
    }
    this.verifyExternalToken(token, externalUser.externalId);

    const user = await this.synchronizeUser(externalUser);
    if (!user.activo || user.estado !== 'ACTIVO') {
      throw new ForbiddenException('El usuario está inactivo en el sistema de parqueos.');
    }

    return {
      ok: true,
      usuario: {
        id: user.id,
        external_id: user.external_auth_id,
        email: user.email,
        rol_id: user.rol_id,
      },
      token,
    };
  }

  async registroProxy(datos: RegisterDto) {
    let response: ExternalAuthResponse;
    try {
      const result = await lastValueFrom(
        this.httpService.post<ExternalAuthResponse>(
          `${this.getExternalApiBaseUrl()}/api/registro`,
          {
            correo: datos.email.trim().toLowerCase(),
            password: datos.password,
            ...(datos.nombres ? { nombres: datos.nombres.trim() } : {}),
            ...(datos.apellidos ? { apellidos: datos.apellidos.trim() } : {}),
          },
          { headers: this.getExternalApiHeaders() },
        ),
      );
      response = result.data;
    } catch (error) {
      this.throwExternalError(error, 'No fue posible completar el registro externo.');
    }

    if (!response?.ok) {
      throw new UnprocessableEntityException('El servicio externo rechazó el registro.');
    }
    if (!response.usuario) {
      throw new BadGatewayException(
        'El servicio externo confirmó el registro, pero no devolvió la identidad necesaria para sincronizarlo.',
      );
    }

    const user = await this.synchronizeUser(this.normalizeExternalUser(response.usuario));
    return {
      ok: true,
      mensaje: 'Registro completado y usuario sincronizado.',
      usuario: {
        id: user.id,
        external_id: user.external_auth_id,
        email: user.email,
        rol_id: user.rol_id,
      },
    };
  }

  private getExternalApiBaseUrl(): string {
    const url = process.env.EXTERNAL_API_URL;
    if (!url) {
      throw new InternalServerErrorException('Falta configurar EXTERNAL_API_URL.');
    }

    return url.replace(/\/+$/, '').replace(/\/api$/, '');
  }

  private getExternalApiHeaders(): Record<string, string> {
    const apiKey = process.env.EXTERNAL_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('Falta configurar EXTERNAL_API_KEY.');
    }

    return { 'x-api-key': apiKey };
  }

  private throwExternalError(error: unknown, fallbackMessage: string): never {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }
      if (status === 409) {
        throw new ConflictException('La identidad o el correo ya están registrados.');
      }
      if (status === 400 || status === 422) {
        throw new BadRequestException(fallbackMessage);
      }
    }
    throw new BadGatewayException(fallbackMessage);
  }

  private verifyExternalToken(token: string, expectedExternalId: string): void {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('Falta configurar JWT_SECRET.');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new BadGatewayException('La API externa devolvió un token JWT inválido.');
    }

    try {
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')) as {
        alg?: string;
      };
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as {
        id?: number | string;
        exp?: number;
        nbf?: number;
      };
      const signature = Buffer.from(parts[2], 'base64url');
      const expectedSignature = createHmac('sha256', secret)
        .update(`${parts[0]}.${parts[1]}`)
        .digest();
      const now = Math.floor(Date.now() / 1000);

      if (
        header.alg !== 'HS256' ||
        signature.length !== expectedSignature.length ||
        !timingSafeEqual(signature, expectedSignature) ||
        String(payload.id ?? '') !== expectedExternalId ||
        typeof payload.exp !== 'number' ||
        payload.exp <= now ||
        (payload.nbf !== undefined &&
          (typeof payload.nbf !== 'number' || payload.nbf > now))
      ) {
        throw new BadGatewayException(
          'El token externo no tiene una firma, vigencia o identidad válidas.',
        );
      }
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }
      throw new BadGatewayException('La API externa devolvió un token JWT inválido.');
    }
  }

  private async synchronizeUser(normalized: NormalizedExternalUser) {

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const role = await transaction.rol.findUnique({
          where: { id: normalized.roleId },
        });
        if (!role || !role.activo) {
          throw new BadGatewayException(
            'El rol devuelto por el servicio externo no existe o está inactivo localmente.',
          );
        }

        const byExternalId = await transaction.usuario.findUnique({
          where: { external_auth_id: normalized.externalId },
        });
        const byEmail = await transaction.usuario.findUnique({
          where: { email: normalized.email },
        });

        if (byEmail && byExternalId && byEmail.id !== byExternalId.id) {
          throw new ConflictException('El correo ya está asociado a otra cuenta local.');
        }

        const existingUser = byExternalId ?? byEmail;
        if (existingUser?.external_auth_id && existingUser.external_auth_id !== normalized.externalId) {
          throw new ConflictException('El correo ya está asociado a otra identidad externa.');
        }

        if (existingUser) {
          return transaction.usuario.update({
            where: { id: existingUser.id },
            data: {
              external_auth_id: normalized.externalId,
              email: normalized.email,
              rol_id: normalized.roleId,
              ...(normalized.state ? { estado: normalized.state } : {}),
              ...(normalized.active !== undefined ? { activo: normalized.active } : {}),
            },
          });
        }

        return transaction.usuario.create({
          data: {
            email: normalized.email,
            external_auth_id: normalized.externalId,
            password_hash: null,
            estado: normalized.state ?? 'ACTIVO',
            activo: normalized.active ?? true,
            rol_id: normalized.roleId,
          },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const synchronized = await this.prisma.usuario.findUnique({
          where: { external_auth_id: normalized.externalId },
        });
        if (synchronized?.email === normalized.email) {
          return synchronized;
        }
        throw new ConflictException('El correo o la identidad ya están asociados a otra cuenta.');
      }
      throw error;
    }
  }

  private normalizeExternalUser(user: ExternalAuthUser): NormalizedExternalUser {
    const rawId =
      typeof user?.id === 'number' || typeof user?.id === 'string'
        ? String(user.id).trim()
        : '';
    const externalId = /^\d+$/.test(rawId) ? String(Number(rawId)) : '';
    const email = typeof user?.correo === 'string' ? user.correo.trim().toLowerCase() : '';
    const rawRole =
      typeof user?.rol === 'number' || typeof user?.rol === 'string' ? user.rol : '';
    const roleId = Number(rawRole);
    const state =
      typeof user?.estado === 'string'
        ? user.estado.trim().toUpperCase()
        : user?.estado === undefined
          ? undefined
          : '';

    if (
      !externalId ||
      !Number.isSafeInteger(Number(externalId)) ||
      Number(externalId) < 1 ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Number.isSafeInteger(roleId) ||
      roleId < 1 ||
      (user.activo !== undefined && typeof user.activo !== 'boolean') ||
      (state !== undefined && state !== 'ACTIVO' && state !== 'INACTIVO')
    ) {
      throw new BadGatewayException(
        'El servicio externo devolvió datos de identidad inválidos o incompletos.',
      );
    }

    const stateActive = state === undefined ? undefined : state === 'ACTIVO';
    if (user.activo !== undefined && stateActive !== undefined && user.activo !== stateActive) {
      throw new BadGatewayException(
        'El servicio externo devolvió un estado de identidad inconsistente.',
      );
    }

    const active = user.activo ?? stateActive;
    return {
      externalId,
      email,
      roleId,
      active,
      state: active === undefined ? undefined : active ? 'ACTIVO' : 'INACTIVO',
    };
  }
}
