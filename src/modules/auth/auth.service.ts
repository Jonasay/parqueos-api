import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { isAxiosError } from 'axios';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface ExternalAuthUser {
  id: number | string;
  correo: string;
  rol: number | string;
  nombre?: string;
  apellido?: string;
}

export interface ExternalAuthResponse {
  ok?: boolean;
  mensaje?: string;
  usuario?: ExternalAuthUser;
  token?: string;
  access_token?: string;
  jwt?: string;
}

@Injectable()
export class AuthService {
  private readonly externalApiUrl = process.env.EXTERNAL_API_URL;
  private readonly externalApiKey = process.env.EXTERNAL_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async loginProxy(credenciales: LoginDto) {
    return this.authenticateAndSynchronize(credenciales.email, credenciales.password);
  }

  async registroProxy(datos: any) {
    let response: ExternalAuthResponse;
    try {
      const resultado = await lastValueFrom(
        this.httpService.post<ExternalAuthResponse>(
          `${this.getExternalApiBaseUrl()}/api/registro`,
          datos,
          { headers: this.getExternalApiHeaders() },
        )
      );
      response = resultado.data;
    } catch {
      throw new InternalServerErrorException('Fallo al registrar usuario en el servicio externo.');
    }

    if (!response?.ok) {
      return response;
    }

    if (!datos?.correo || !datos?.password) {
      throw new InternalServerErrorException(
        'El registro externo fue exitoso, pero no se recibieron credenciales para sincronizar la cuenta en Render.',
      );
    }

    await this.authenticateAndSynchronize(datos.correo, datos.password);
    return response;
  }

  private async authenticateAndSynchronize(email: string, password: string) {
    let data: ExternalAuthResponse;
    try {
      const respuesta = await lastValueFrom(
        this.httpService.post<ExternalAuthResponse>(
          `${this.getExternalApiBaseUrl()}/api/login`,
          { correo: email, password },
          { headers: this.getExternalApiHeaders() },
        )
      );
      data = respuesta.data;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }
      throw new InternalServerErrorException(
        'Error de comunicación con el servicio externo de autenticación.',
      );
    }

    if (!data?.ok || !data.usuario) {
      throw new UnauthorizedException(data?.mensaje || 'Credenciales inválidas.');
    }
    if (!data.token && !data.access_token && !data.jwt) {
      throw new InternalServerErrorException('La API externa no devolvió un token de acceso.');
    }

    const localUser = await this.synchronizeUser(data.usuario);
    if (!localUser.activo || localUser.estado !== 'ACTIVO') {
      throw new ForbiddenException('El usuario está inactivo en el sistema de parqueos.');
    }

    return {
      ...data,
      usuario: {
        ...data.usuario,
        id: localUser.id,
        rol: localUser.rol_id,
      },
    };
  }

  private getExternalApiBaseUrl(): string {
    if (!this.externalApiUrl) {
      throw new InternalServerErrorException('Falta configurar EXTERNAL_API_URL.');
    }

    return this.externalApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  }

  private getExternalApiHeaders(): Record<string, string> {
    if (!this.externalApiKey) {
      throw new InternalServerErrorException('Falta configurar EXTERNAL_API_KEY.');
    }

    return { 'x-api-key': this.externalApiKey };
  }

  private async synchronizeUser(externalUser: ExternalAuthUser) {
    const externalIdNumber = Number(externalUser.id);
    const externalId = String(externalIdNumber);
    const email = externalUser.correo?.trim().toLowerCase();
    const roleId = Number(externalUser.rol);

    if (
      !Number.isInteger(externalIdNumber) ||
      externalIdNumber < 1 ||
      !email ||
      !Number.isInteger(roleId) ||
      roleId < 1
    ) {
      throw new InternalServerErrorException(
        'La API externa devolvió datos de usuario incompletos para sincronizar.',
      );
    }

    const localUser = await this.prisma.usuario.findUnique({
      where: { external_auth_id: externalId },
    });

    if (localUser) {
      const profile: { email?: string; nombre?: string; apellido?: string } =
        this.getProfileUpdates(localUser, externalUser);
      if (localUser.email !== email) profile.email = email;
      if (Object.keys(profile).length > 0) {
        return this.prisma.usuario.update({
          where: { id: localUser.id },
          data: profile,
        });
      }
      return localUser;
    }

    const existingByEmail = await this.prisma.usuario.findUnique({ where: { email } });
    if (existingByEmail) {
      if (existingByEmail.external_auth_id && existingByEmail.external_auth_id !== externalId) {
        throw new InternalServerErrorException(
          'El correo ya está asociado a otra identidad externa en Render.',
        );
      }

      return this.prisma.usuario.update({
        where: { id: existingByEmail.id },
        data: {
          external_auth_id: externalId,
          ...this.getProfileUpdates(existingByEmail, externalUser),
        },
      });
    }

    const role = await this.prisma.rol.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new InternalServerErrorException(
        `El rol externo ${roleId} no existe en Render. Configura primero los roles correspondientes.`,
      );
    }

    return this.prisma.usuario.create({
      data: {
        email,
        nombre: externalUser.nombre?.trim() || null,
        apellido: externalUser.apellido?.trim() || null,
        external_auth_id: externalId,
        password_hash: null,
        estado: 'ACTIVO',
        rol_id: roleId,
      },
    });
  }

  private getProfileUpdates(
    localUser: { nombre: string | null; apellido: string | null },
    externalUser: ExternalAuthUser,
  ): { nombre?: string; apellido?: string } {
    const updates: { nombre?: string; apellido?: string } = {};
    const nombre = externalUser.nombre?.trim();
    const apellido = externalUser.apellido?.trim();

    if (nombre && nombre !== localUser.nombre) updates.nombre = nombre;
    if (apellido && apellido !== localUser.apellido) updates.apellido = apellido;
    return updates;
  }
}