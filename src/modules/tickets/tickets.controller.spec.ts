import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';
import { RegistrarEntradaTicketDto } from './dto/registrar-entrada-ticket.dto.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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
    await controller.registrarEntrada(body);

    expect(mockTicketsService.registrarEntrada).toHaveBeenCalledWith(1, 5, 2);
  });

  it('registra la entrada usando los nombres snake_case', async () => {
    const body = plainToInstance(RegistrarEntradaTicketDto, {
      vehiculo_id: 1,
      espacio_id: 5,
      empleado_ingreso_id: 2,
    });

    expect(await validate(body, { whitelist: true, forbidNonWhitelisted: true })).toHaveLength(0);
    await controller.registrarEntrada(body);

    expect(mockTicketsService.registrarEntrada).toHaveBeenCalledWith(1, 5, 2);
  });

  it('rechaza la entrada si falta un ID requerido', async () => {
    const body = plainToInstance(RegistrarEntradaTicketDto, {
      vehiculo_id: 1,
      espacio_id: 5,
    });

    expect((await validate(body, { whitelist: true, forbidNonWhitelisted: true })).length).toBeGreaterThan(0);
  });
});
