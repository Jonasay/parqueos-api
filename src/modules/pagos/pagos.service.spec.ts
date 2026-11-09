import { Test, TestingModule } from '@nestjs/testing';
import { PagosService } from './pagos.service.js';
import { PAGOS_REPOSITORY } from './repositories/pagos.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('PagosService', () => {
  let service: PagosService;

  const mockPagosRepository = {
    registrarPago: vi.fn(),
    registrarPagoYMarcarTicketComoPagado: vi.fn(),
    obtenerTicketPorId: vi.fn(),
    marcarTicketComoPagado: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: PAGOS_REPOSITORY, useValue: mockPagosRepository },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe procesar un pago exitosamente si el ticket es válido', async () => {
    const dto = { ticket_id: 1, total_pagado: 25.5, metodo_pago_id: 1 };
    mockPagosRepository.obtenerTicketPorId.mockResolvedValue({ id: 1, estado: 'FINALIZADO' });
    mockPagosRepository.registrarPagoYMarcarTicketComoPagado.mockResolvedValue({ id: 99, ...dto });
    
    const result = await service.procesarPago(dto);
    
    expect(result.id).toEqual(99);
    expect(mockPagosRepository.registrarPagoYMarcarTicketComoPagado).toHaveBeenCalled();
  });

  it('3. Debe lanzar NotFoundException (404) si el ticket no existe', async () => {
    mockPagosRepository.obtenerTicketPorId.mockResolvedValue(null);
    await expect(service.procesarPago({ ticket_id: 999 })).rejects.toThrow(NotFoundException);
    expect(mockPagosRepository.registrarPagoYMarcarTicketComoPagado).not.toHaveBeenCalled();
  });

  it('4. Debe lanzar UnprocessableEntityException (422) si el ticket ya fue pagado', async () => {
    mockPagosRepository.obtenerTicketPorId.mockResolvedValue({ id: 1, estado: 'PAGADO' });
    await expect(service.procesarPago({ ticket_id: 1 })).rejects.toThrow(UnprocessableEntityException);
    expect(mockPagosRepository.registrarPagoYMarcarTicketComoPagado).not.toHaveBeenCalled();
  });

  it('no procesa el pago antes de registrar la salida', async () => {
    mockPagosRepository.obtenerTicketPorId.mockResolvedValue({ id: 1, estado: 'ACTIVO' });

    await expect(service.procesarPago({ ticket_id: 1 })).rejects.toThrow(
      UnprocessableEntityException,
    );
    expect(mockPagosRepository.registrarPagoYMarcarTicketComoPagado).not.toHaveBeenCalled();
  });

  it('propaga errores de pago y mantiene el cambio transaccional', async () => {
    mockPagosRepository.obtenerTicketPorId.mockResolvedValue({ id: 1, estado: 'FINALIZADO' });
    mockPagosRepository.registrarPagoYMarcarTicketComoPagado.mockRejectedValue(
      new Error('Fallo de BD'),
    );
    
    await expect(service.procesarPago({ ticket_id: 1 })).rejects.toThrow();
  });
});