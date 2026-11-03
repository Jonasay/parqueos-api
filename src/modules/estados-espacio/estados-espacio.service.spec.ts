import { Test, TestingModule } from '@nestjs/testing';
import { EstadosEspacioService } from './estados-espacio.service.js';
import { ESTADOS_ESPACIO_REPOSITORY } from './repositories/estados-espacio.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('EstadosEspacioService', () => {
  let service: EstadosEspacioService;

  const mockEstadosEspacioRepository = {
    crear: vi.fn(),
    buscarPorNombre: vi.fn(),
    buscarPorId: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstadosEspacioService,
        { provide: ESTADOS_ESPACIO_REPOSITORY, useValue: mockEstadosEspacioRepository },
      ],
    }).compile();

    service = module.get<EstadosEspacioService>(EstadosEspacioService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear un estado si el nombre no existe', async () => {
    mockEstadosEspacioRepository.buscarPorNombre.mockResolvedValue(null);
    mockEstadosEspacioRepository.crear.mockResolvedValue({ id: 1, nombre: 'Disponible' });
    
    const result = await service.registrarEstado({ nombre: 'Disponible' });
    expect(result).toHaveProperty('id');
    expect(mockEstadosEspacioRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si el nombre ya existe', async () => {
    mockEstadosEspacioRepository.buscarPorNombre.mockResolvedValue({ id: 1, nombre: 'Mantenimiento' });
    await expect(service.registrarEstado({ nombre: 'Mantenimiento' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar un estado al buscar por un ID válido', async () => {
    mockEstadosEspacioRepository.buscarPorId.mockResolvedValue({ id: 2, nombre: 'Ocupado' });
    const result = await service.buscarPorId(2);
    expect(result.nombre).toEqual('Ocupado');
  });

  it('5. Debe lanzar NotFoundException si el ID buscado no existe', async () => {
    mockEstadosEspacioRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
  });
});