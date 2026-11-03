import { Test, TestingModule } from '@nestjs/testing';
import { NivelesParqueoService } from './niveles-parqueo.service.js';
import { NIVELES_PARQUEO_REPOSITORY } from './repositories/niveles-parqueo.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('NivelesParqueoService', () => {
  let service: NivelesParqueoService;

  const mockNivelesParqueoRepository = {
    crear: vi.fn(),
    buscarPorNombreYSucursal: vi.fn(),
    buscarPorId: vi.fn(),
    obtenerPorSucursal: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NivelesParqueoService,
        { provide: NIVELES_PARQUEO_REPOSITORY, useValue: mockNivelesParqueoRepository },
      ],
    }).compile();

    service = module.get<NivelesParqueoService>(NivelesParqueoService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe registrar un nivel si el nombre no está duplicado en la sucursal', async () => {
    mockNivelesParqueoRepository.buscarPorNombreYSucursal.mockResolvedValue(null);
    mockNivelesParqueoRepository.crear.mockResolvedValue({ id: 1, nombre_nivel: 'Nivel 1' });
    
    const result = await service.registrarNivel({ nombre_nivel: 'Nivel 1', sucursal_id: 10 });
    expect(result).toHaveProperty('id');
    expect(mockNivelesParqueoRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si el nivel ya existe en la sucursal', async () => {
    mockNivelesParqueoRepository.buscarPorNombreYSucursal.mockResolvedValue({ id: 1 });
    await expect(service.registrarNivel({ nombre_nivel: 'Nivel 1', sucursal_id: 10 })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar un nivel si el ID es válido', async () => {
    mockNivelesParqueoRepository.buscarPorId.mockResolvedValue({ id: 5, nombre_nivel: 'Sótano 2' });
    const result = await service.buscarPorId(5);
    expect(result.id).toEqual(5);
  });

  it('5. Debe lanzar NotFoundException si el ID del nivel no existe', async () => {
    mockNivelesParqueoRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
  });
});