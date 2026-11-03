import { Test, TestingModule } from '@nestjs/testing';
import { MetodosPagoService } from './metodos-pago.service.js';
import { METODOS_PAGO_REPOSITORY } from './repositories/metodos-pago.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('MetodosPagoService', () => {
  let service: MetodosPagoService;

  const mockMetodosPagoRepository = {
    crear: vi.fn(),
    buscarPorNombre: vi.fn(),
    buscarPorId: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetodosPagoService,
        { provide: METODOS_PAGO_REPOSITORY, useValue: mockMetodosPagoRepository },
      ],
    }).compile();

    service = module.get<MetodosPagoService>(MetodosPagoService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear un método si el nombre no existe', async () => {
    mockMetodosPagoRepository.buscarPorNombre.mockResolvedValue(null);
    mockMetodosPagoRepository.crear.mockResolvedValue({ id: 1, nombre: 'Efectivo' });
    
    const result = await service.registrarMetodo({ nombre: 'Efectivo' });
    expect(result).toHaveProperty('id');
    expect(mockMetodosPagoRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si el nombre ya existe', async () => {
    mockMetodosPagoRepository.buscarPorNombre.mockResolvedValue({ id: 1, nombre: 'Tarjeta' });
    await expect(service.registrarMetodo({ nombre: 'Tarjeta' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar el método al buscar por un ID válido', async () => {
    mockMetodosPagoRepository.buscarPorId.mockResolvedValue({ id: 2, nombre: 'Transferencia' });
    const result = await service.buscarPorId(2);
    expect(result.nombre).toEqual('Transferencia');
  });

  it('5. Debe lanzar NotFoundException si el ID buscado no existe', async () => {
    mockMetodosPagoRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
  });
});
