import { Test, TestingModule } from '@nestjs/testing';
import { TiposVehiculoService } from './tipos-vehiculo.service.js';
import { TIPOS_VEHICULO_REPOSITORY } from './repositories/tipos-vehiculo.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('TiposVehiculoService', () => {
  let service: TiposVehiculoService;

  const mockTiposVehiculoRepository = {
    crear: vi.fn(),
    buscarPorNombre: vi.fn(),
    buscarPorId: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiposVehiculoService,
        { provide: TIPOS_VEHICULO_REPOSITORY, useValue: mockTiposVehiculoRepository },
      ],
    }).compile();

    service = module.get<TiposVehiculoService>(TiposVehiculoService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear un tipo de vehículo si el nombre no existe', async () => {
    mockTiposVehiculoRepository.buscarPorNombre.mockResolvedValue(null);
    mockTiposVehiculoRepository.crear.mockResolvedValue({ id: 1, nombre: 'Moto' });
    
    const result = await service.registrarTipo({ nombre: 'Moto' });
    expect(result).toHaveProperty('id');
    expect(mockTiposVehiculoRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si el nombre ya está registrado', async () => {
    mockTiposVehiculoRepository.buscarPorNombre.mockResolvedValue({ id: 1, nombre: 'Moto' });
    await expect(service.registrarTipo({ nombre: 'Moto' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar un tipo de vehículo al buscar por ID válido', async () => {
    mockTiposVehiculoRepository.buscarPorId.mockResolvedValue({ id: 2, nombre: 'Sedán' });
    const result = await service.buscarPorId(2);
    expect(result.nombre).toEqual('Sedán');
  });

  it('5. Debe lanzar NotFoundException si el ID buscado no existe', async () => {
    mockTiposVehiculoRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
  });
});