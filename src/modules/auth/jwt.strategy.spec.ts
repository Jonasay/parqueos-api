import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtStrategy } from './jwt.strategy.js';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const prisma = {
    usuario: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    vi.clearAllMocks();
  });

  it('resolves external token identity to the local Render user ID', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 8,
      email: 'operador@example.test',
      activo: true,
      estado: 'ACTIVO',
    });

    await expect(strategy.validate({ id: 17, email: 'operador@example.test' })).resolves.toEqual({
      usuarioId: 8,
      email: 'operador@example.test',
    });
    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { external_auth_id: '17' },
    });
  });

  it('rejects external identities that have not been synchronized', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(strategy.validate({ id: 17 })).rejects.toThrow(UnauthorizedException);
  });
});
