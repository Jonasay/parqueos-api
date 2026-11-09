import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';
import { RegistrarEntradaTicketDto } from './dto/registrar-entrada-ticket.dto.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';

describe('TicketsController', () => {
  let controller: TicketsController;
  const mockTicketsService = {
    registrarEntrada: vi.fn(),
    procesarSalida: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registra la entrada usando los nombres camelCase del DTO', async () => {
    const body = plainToInstance(RegistrarEntradaTicketDto, {
      vehiculoId: 1,
      espacioId: 5,
      empleadoId: 2,
    });

    expect(await validate(body, { whitelist: true, forbidNonWhitelisted: true })).toHaveLength(0);
    await controller.registrarEntrada(body, { user: { usuarioId: 10 } } as never);

    expect(mockTicketsService.registrarEntrada).toHaveBeenCalledWith({
      vehiculoId: 1,
      placa: undefined,
      espacioId: 5,
      empleadoId: 2,
      usuarioId: 10,
    });
  });

  it('registra la entrada por placa sin exigir IDs de vehículo o empleado', async () => {
    const body = plainToInstance(RegistrarEntradaTicketDto, {
      placa: 'P-123ABC',
      espacioId: '5',
    });

    expect(await validate(body, { whitelist: true, forbidNonWhitelisted: true })).toHaveLength(0);
    await controller.registrarEntrada(body, { user: { usuarioId: 10 } } as never);

    expect(mockTicketsService.registrarEntrada).toHaveBeenCalledWith({
      vehiculoId: undefined,
      placa: 'P-123ABC',
      espacioId: 5,
      empleadoId: undefined,
      usuarioId: 10,
    });
  });

  it('rechaza la entrada si no se envía ID ni placa de vehículo', async () => {
    const body = plainToInstance(RegistrarEntradaTicketDto, {
      espacioId: 5,
    });

    expect(await validate(body, { whitelist: true, forbidNonWhitelisted: true })).toHaveLength(0);
    await expect(
      controller.registrarEntrada(body, { user: { usuarioId: 10 } } as never),
    ).rejects.toThrow(BadRequestException);
  });
});
