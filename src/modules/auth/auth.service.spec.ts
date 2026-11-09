import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';
import { of } from 'rxjs';

function signExternalToken(externalId = '17'): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ id: externalId, exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString('base64url');
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac('sha256', 'test-jwt-secret')
    .update(unsignedToken)
    .digest('base64url');
  return `${unsignedToken}.${signature}`;
}

describe('AuthService', () => {
  let service: AuthService;
  const post = vi.fn();
  const transaction = {
    usuario: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    rol: { findUnique: vi.fn() },
  };
  const prisma = {
    $transaction: vi.fn((callback: (tx: typeof transaction) => unknown) =>
      callback(transaction),
    ),
    usuario: { findUnique: vi.fn() },
  };

  beforeEach(async () => {
    vi.stubEnv('EXTERNAL_API_URL', 'https://auth.example.test');
    vi.stubEnv('EXTERNAL_API_KEY', 'test-api-key');
    vi.stubEnv('JWT_SECRET', 'test-jwt-secret');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: { post } },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    vi.clearAllMocks();
  });

  it('proxies login, synchronizes the external identity and verifies the external JWT', async () => {
    const externalToken = signExternalToken();
    post.mockReturnValue(
      of({
        data: {
          ok: true,
          usuario: { id: '017', correo: ' Operador@Example.Test ', rol: '2' },
          token: externalToken,
        },
      }),
    );
    transaction.rol.findUnique.mockResolvedValue({ id: 2, activo: true });
    transaction.usuario.findUnique.mockResolvedValue(null);
    transaction.usuario.create.mockResolvedValue({
      id: 8,
      email: 'operador@example.test',
      external_auth_id: '17',
      rol_id: 2,
      activo: true,
      estado: 'ACTIVO',
    });

    const result = await service.loginProxy({
      email: 'operador@example.test',
      password: 'password',
    });

    expect(post).toHaveBeenCalledWith(
      'https://auth.example.test/api/login',
      { correo: 'operador@example.test', password: 'password' },
      { headers: { 'x-api-key': 'test-api-key' } },
    );
    expect(transaction.usuario.create).toHaveBeenCalledWith({
      data: {
        email: 'operador@example.test',
        external_auth_id: '17',
        password_hash: null,
        estado: 'ACTIVO',
        activo: true,
        rol_id: 2,
      },
    });
    expect(result.usuario).toEqual({
      id: 8,
      external_id: '17',
      email: 'operador@example.test',
      rol_id: 2,
    });
    const [header, payload, signature] = result.token.split('.');
    expect(result.token).toBe(externalToken);
    expect(JSON.parse(Buffer.from(payload, 'base64url').toString()).id).toBe('17');
    expect(signature).toBe(
      createHmac('sha256', 'test-jwt-secret')
        .update(`${header}.${payload}`)
        .digest('base64url'),
    );
  });

  it('registers externally and idempotently synchronizes the returned identity', async () => {
    post.mockReturnValue(
      of({
        data: {
          ok: true,
          mensaje: 'Creado',
          usuario: { id: 17, correo: 'OPERADOR@example.test', rol: 2 },
        },
      }),
    );
    transaction.rol.findUnique.mockResolvedValue({ id: 2, activo: true });
    transaction.usuario.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    transaction.usuario.create.mockResolvedValue({
      id: 8,
      email: 'operador@example.test',
      external_auth_id: '17',
      rol_id: 2,
    });

    const result = await service.registroProxy({
      email: 'Operador@example.test',
      password: 'password123',
      nombres: 'Operador',
    });

    expect(post).toHaveBeenCalledWith(
      'https://auth.example.test/api/registro',
      { correo: 'operador@example.test', password: 'password123', nombres: 'Operador' },
      { headers: { 'x-api-key': 'test-api-key' } },
    );
    expect(transaction.usuario.create).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      ok: true,
      usuario: { id: 8, external_id: '17', email: 'operador@example.test', rol_id: 2 },
    });
  });

  it('reuses the same local account for a repeated external identity', async () => {
    post.mockReturnValue(
      of({ data: { ok: true, usuario: { id: 17, correo: 'user@example.test', rol: 2 } } }),
    );
    transaction.rol.findUnique.mockResolvedValue({ id: 2, activo: true });
    transaction.usuario.findUnique
      .mockResolvedValueOnce({ id: 8, external_auth_id: '17', email: 'user@example.test' })
      .mockResolvedValueOnce({ id: 8, external_auth_id: '17', email: 'user@example.test' });
    transaction.usuario.update.mockResolvedValue({
      id: 8,
      email: 'user@example.test',
      external_auth_id: '17',
      rol_id: 2,
    });

    await service.registroProxy({ email: 'user@example.test', password: 'password123' });

    expect(transaction.usuario.create).not.toHaveBeenCalled();
    expect(transaction.usuario.update).toHaveBeenCalledOnce();
  });

  it('rejects a conflicting local email without duplicating accounts', async () => {
    post.mockReturnValue(
      of({ data: { ok: true, usuario: { id: 17, correo: 'user@example.test', rol: 2 } } }),
    );
    transaction.rol.findUnique.mockResolvedValue({ id: 2, activo: true });
    transaction.usuario.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 9, external_auth_id: '18', email: 'user@example.test' });

    await expect(
      service.registroProxy({ email: 'user@example.test', password: 'password123' }),
    ).rejects.toThrow(ConflictException);
    expect(transaction.usuario.create).not.toHaveBeenCalled();
  });

  it('does not reactivate a user disabled locally when the external service omits status', async () => {
    post.mockReturnValue(
      of({
        data: {
          ok: true,
          usuario: { id: 17, correo: 'user@example.test', rol: 2 },
          token: signExternalToken(),
        },
      }),
    );
    transaction.rol.findUnique.mockResolvedValue({ id: 2, activo: true });
    transaction.usuario.findUnique
      .mockResolvedValueOnce({
        id: 8,
        external_auth_id: '17',
        email: 'user@example.test',
        activo: false,
        estado: 'INACTIVO',
      })
      .mockResolvedValueOnce({
        id: 8,
        external_auth_id: '17',
        email: 'user@example.test',
        activo: false,
        estado: 'INACTIVO',
      });
    transaction.usuario.update.mockResolvedValue({
      id: 8,
      external_auth_id: '17',
      email: 'user@example.test',
      activo: false,
      estado: 'INACTIVO',
      rol_id: 2,
    });

    await expect(
      service.loginProxy({ email: 'user@example.test', password: 'password123' }),
    ).rejects.toThrow('El usuario está inactivo');
    expect(transaction.usuario.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ activo: true, estado: 'ACTIVO' }),
      }),
    );
  });

  it('rejects an external token whose identity does not match the synchronized user', async () => {
    post.mockReturnValue(
      of({
        data: {
          ok: true,
          usuario: { id: 17, correo: 'user@example.test', rol: 2 },
          token: signExternalToken('18'),
        },
      }),
    );

    await expect(
      service.loginProxy({ email: 'user@example.test', password: 'password123' }),
    ).rejects.toThrow('identidad válidas');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('does not sync a user when external credentials are rejected', async () => {
    post.mockReturnValue(of({ data: { ok: false } }));

    await expect(
      service.loginProxy({ email: 'user@example.test', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
