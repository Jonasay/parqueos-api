import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service.js';
import { of } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const post = vi.fn();
  const prisma = {
    usuario: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    rol: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.stubEnv('EXTERNAL_API_URL', 'https://auth.example.test');
    vi.stubEnv('EXTERNAL_API_KEY', 'test-api-key');
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('proxies login and synchronizes a new external user in Render', async () => {
    const response = {
      ok: true,
      usuario: { id: 17, correo: 'operador@example.test', rol: 2 },
      token: 'signed-token',
    };
    post.mockReturnValue(of({ data: response }));
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.rol.findUnique.mockResolvedValue({ id: 2 });
    prisma.usuario.create.mockResolvedValue({
      id: 8,
      email: 'operador@example.test',
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
    expect(prisma.usuario.create).toHaveBeenCalledWith({
      data: {
        email: 'operador@example.test',
        nombre: null,
        apellido: null,
        external_auth_id: '17',
        password_hash: null,
        estado: 'ACTIVO',
        rol_id: 2,
      },
    });
    expect(result).toMatchObject({
      ok: true,
      usuario: {
        id: 8,
        correo: 'operador@example.test',
        rol: 2,
      },
      token: 'signed-token',
    });
  });

  it('does not sync a user when external credentials are rejected', async () => {
    post.mockReturnValue(of({ data: { ok: false, mensaje: 'Credenciales inválidas.' } }));

    await expect(
      service.loginProxy({ email: 'operador@example.test', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });

  it('synchronizes a newly registered account and its name into Render', async () => {
    post
      .mockReturnValueOnce(of({ data: { ok: true, mensaje: 'Usuario registrado.' } }))
      .mockReturnValueOnce(
        of({
          data: {
            ok: true,
            usuario: {
              id: 21,
              correo: 'jona@example.test',
              rol: 2,
              nombre: 'Jona',
              apellido: 'Pérez',
            },
            token: 'signed-token',
          },
        }),
      );
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.rol.findUnique.mockResolvedValue({ id: 2 });
    prisma.usuario.create.mockResolvedValue({
      id: 9,
      email: 'jona@example.test',
      nombre: 'Jona',
      apellido: 'Pérez',
      rol_id: 2,
      activo: true,
      estado: 'ACTIVO',
    });

    await service.registroProxy({
      nombre: 'Jona',
      apellido: 'Pérez',
      usuario: 'jona',
      correo: 'jona@example.test',
      password: 'password',
    });

    expect(post).toHaveBeenNthCalledWith(
      2,
      'https://auth.example.test/api/login',
      { correo: 'jona@example.test', password: 'password' },
      { headers: { 'x-api-key': 'test-api-key' } },
    );
    expect(prisma.usuario.create).toHaveBeenCalledWith({
      data: {
        email: 'jona@example.test',
        nombre: 'Jona',
        apellido: 'Pérez',
        external_auth_id: '21',
        password_hash: null,
        estado: 'ACTIVO',
        rol_id: 2,
      },
    });
  });
});
