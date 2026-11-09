import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service.js';
import { TICKETS_REPOSITORY } from './repositories/tickets.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { vi } from 'vitest';

describe('TicketsService', () => {
  let service: TicketsService;
  
  // Mock del Repositorio (Garantiza que NO tocamos la BD real)
  const mockTicketsRepository = {
    registrarEntrada: vi.fn(),
    buscarPorCodigo: vi.fn(),
    actualizarSalida: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: TICKETS_REPOSITORY,
          useValue: mockTicketsRepository, // Inyectamos el mock
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    vi.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // Prueba 1: Registro exitoso
  it('1. Debe registrar la entrada de un vehículo correctamente', async () => {
    const mockTicket = { id: 1, codigo_ticket: 'uuid-123', estado: 'ACTIVO' };
    const datosEntrada = {
      vehiculoId: 1,
      espacioId: 5,
      usuarioId: 10,
    };
    mockTicketsRepository.registrarEntrada.mockResolvedValue(mockTicket);

    const result = await service.registrarEntrada(datosEntrada);
    expect(result).toEqual(mockTicket);
    expect(mockTicketsRepository.registrarEntrada).toHaveBeenCalledWith(datosEntrada);
  });

  // Prueba 2: Salida exitosa
  it('2. Debe procesar la salida de un ticket activo', async () => {
    const mockTicket = { id: 1, codigo_ticket: 'uuid-123', estado: 'ACTIVO' };
    mockTicketsRepository.buscarPorCodigo.mockResolvedValue(mockTicket);
    mockTicketsRepository.actualizarSalida.mockResolvedValue({ ...mockTicket, estado: 'FINALIZADO' });

    const result = await service.procesarSalida('uuid-123');
    expect(result.estado).toBe('FINALIZADO');
    expect(mockTicketsRepository.buscarPorCodigo).toHaveBeenCalledWith('uuid-123');
  });

  // Prueba 3: Manejo de error 404 (Código HTTP)
  it('3. Debe lanzar NotFoundException (404) si el ticket no existe', async () => {
    mockTicketsRepository.buscarPorCodigo.mockResolvedValue(null);

    await expect(service.procesarSalida('invalido-404')).rejects.toThrow(NotFoundException);
  });

  // Prueba 4: Manejo de error 422 (Código HTTP)
  it('4. Debe lanzar UnprocessableEntityException (422) si el ticket ya está finalizado', async () => {
    const mockTicketFinalizado = { id: 1, codigo_ticket: 'uuid-123', estado: 'FINALIZADO' };
    mockTicketsRepository.buscarPorCodigo.mockResolvedValue(mockTicketFinalizado);

    await expect(service.procesarSalida('uuid-123')).rejects.toThrow(UnprocessableEntityException);
  });

  // Prueba 5: Aislamiento del Repositorio
  it('5. No debe llamar a actualizarSalida si buscarPorCodigo falla', async () => {
    mockTicketsRepository.buscarPorCodigo.mockResolvedValue(null);

    await expect(service.procesarSalida('uuid-inexistente')).rejects.toThrow(NotFoundException);

    expect(mockTicketsRepository.actualizarSalida).not.toHaveBeenCalled();
  });
});