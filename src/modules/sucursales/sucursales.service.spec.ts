import { Test, TestingModule } from '@nestjs/testing';
import { SucursalesService } from './sucursales.service.js';
import { SUCURSALES_REPOSITORY } from './repositories/sucursales.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('SucursalesService', () => {
  let service: SucursalesService;

  const mockSucursalesRepository = {
    crear: vi.fn(),
    buscarPorNombre: vi.fn(),
    obtenerTodas: vi.fn(),
    buscarPorId: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SucursalesService,
        { provide: SUCURSALES_REPOSITORY, useValue: mockSucursalesRepository },
      ],
    }).compile();

    service = module.get<SucursalesService>(SucursalesService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe registrar una sucursal si el nombre no está duplicado', async () => {
    mockSucursalesRepository.buscarPorNombre.mockResolvedValue(null);
    mockSucursalesRepository.crear.mockResolvedValue({ id: 1, nombre: 'Xela Centro' });
    
    const result = await service.registrarSucursal({ nombre: 'Xela Centro', capacidad_maxima: 100 });
    expect(result).toHaveProperty('id');
    expect(mockSucursalesRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException (422) si el nombre ya existe', async () => {
    mockSucursalesRepository.buscarPorNombre.mockResolvedValue({ id: 1, nombre: 'Xela Centro' });
    await expect(service.registrarSucursal({ nombre: 'Xela Centro' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar una sucursal si el ID existe', async () => {
    mockSucursalesRepository.buscarPorId.mockResolvedValue({ id: 3, nombre: 'Zona 3' });
    const result = await service.buscarPorId(3);
    expect(result.id).toEqual(3);
  });

  it('5. Debe lanzar NotFoundException (404) si el ID de sucursal no existe', async () => {
    mockSucursalesRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
  });
});