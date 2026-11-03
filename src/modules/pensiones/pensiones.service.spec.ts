import { Test, TestingModule } from '@nestjs/testing';
import { PensionesService } from './pensiones.service.js';
import { PENSIONES_REPOSITORY } from './repositories/pensiones.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('PensionesService', () => {
  let service: PensionesService;

  const mockPensionesRepository = {
    crear: vi.fn(),
    buscarActivaPorVehiculo: vi.fn(),
    obtenerTodas: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PensionesService,
        { provide: PENSIONES_REPOSITORY, useValue: mockPensionesRepository },
      ],
    }).compile();

    service = module.get<PensionesService>(PensionesService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear pensión si el vehículo no tiene una activa', async () => {
    mockPensionesRepository.buscarActivaPorVehiculo.mockResolvedValue(null);
    mockPensionesRepository.crear.mockResolvedValue({ id: 1, vehiculo_id: 5 });
    
    const result = await service.registrarPension({ vehiculo_id: 5 });
    expect(result).toHaveProperty('id');
    expect(mockPensionesRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si ya existe pensión activa', async () => {
    mockPensionesRepository.buscarActivaPorVehiculo.mockResolvedValue({ id: 1, estado: 'ACTIVA' });
    await expect(service.registrarPension({ vehiculo_id: 5 })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe permitir el acceso retornando la pensión activa', async () => {
    mockPensionesRepository.buscarActivaPorVehiculo.mockResolvedValue({ id: 9, estado: 'ACTIVA' });
    const result = await service.verificarAcceso(5);
    expect(result.id).toEqual(9);
  });

  it('5. Debe lanzar NotFoundException si se verifica acceso sin pensión', async () => {
    mockPensionesRepository.buscarActivaPorVehiculo.mockResolvedValue(null);
    await expect(service.verificarAcceso(5)).rejects.toThrow(NotFoundException);
  });
});