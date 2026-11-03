import { Test, TestingModule } from '@nestjs/testing';
import { VehiculosService } from './vehiculos.service.js';
import { VEHICULOS_REPOSITORY } from './repositories/vehiculos.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('VehiculosService', () => {
  let service: VehiculosService;
  
  const mockVehiculosRepository = {
    crear: vi.fn(),
    buscarPorPlaca: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculosService,
        { provide: VEHICULOS_REPOSITORY, useValue: mockVehiculosRepository },
      ],
    }).compile();

    service = module.get<VehiculosService>(VehiculosService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe registrar un vehículo si la placa no existe', async () => {
    mockVehiculosRepository.buscarPorPlaca.mockResolvedValue(null);
    mockVehiculosRepository.crear.mockResolvedValue({ id: 1, placa: 'ABC-123' });
    
    const result = await service.registrarVehiculo({ placa: 'ABC-123' });
    expect(result).toHaveProperty('id');
    expect(mockVehiculosRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si la placa ya existe', async () => {
    mockVehiculosRepository.buscarPorPlaca.mockResolvedValue({ id: 1, placa: 'ABC-123' });
    
    await expect(service.registrarVehiculo({ placa: 'ABC-123' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar un vehículo si la placa existe', async () => {
    mockVehiculosRepository.buscarPorPlaca.mockResolvedValue({ id: 1, placa: 'XYZ-987' });
    const result = await service.buscarPorPlaca('XYZ-987');
    expect(result.placa).toEqual('XYZ-987');
  });

  it('5. Debe lanzar NotFoundException si la placa no se encuentra', async () => {
    mockVehiculosRepository.buscarPorPlaca.mockResolvedValue(null);
    await expect(service.buscarPorPlaca('NO-EXISTE')).rejects.toThrow(NotFoundException);
  });
});
