import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service.js';
import { ROLES_REPOSITORY } from './repositories/roles.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;

  const mockRolesRepository = {
    crear: vi.fn(),
    buscarPorNombre: vi.fn(),
    buscarPorId: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: ROLES_REPOSITORY, useValue: mockRolesRepository },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear un rol si el nombre no existe', async () => {
    mockRolesRepository.buscarPorNombre.mockResolvedValue(null);
    mockRolesRepository.crear.mockResolvedValue({ id: 1, nombre: 'Admin' });
    
    const result = await service.registrarRol({ nombre: 'Admin' });
    expect(result).toHaveProperty('id');
    expect(mockRolesRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si el nombre ya existe', async () => {
    mockRolesRepository.buscarPorNombre.mockResolvedValue({ id: 1, nombre: 'Operador' });
    await expect(service.registrarRol({ nombre: 'Operador' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar el rol al buscar por un ID válido', async () => {
    mockRolesRepository.buscarPorId.mockResolvedValue({ id: 2, nombre: 'Cliente' });
    const result = await service.buscarPorId(2);
    expect(result.nombre).toEqual('Cliente');
  });

  it('5. Debe lanzar NotFoundException si el ID buscado no existe', async () => {
    mockRolesRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
  });
});