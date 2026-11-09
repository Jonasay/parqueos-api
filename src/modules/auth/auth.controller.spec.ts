import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    loginProxy: vi.fn(),
    registroProxy: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('rejects a client-supplied role in registration', async () => {
    const registration = plainToInstance(RegisterDto, {
      email: 'user@example.test',
      password: 'password123',
      rol: 1,
    });

    const errors = await validate(registration, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors[0]?.constraints).toHaveProperty('whitelistValidation');
  });
});
