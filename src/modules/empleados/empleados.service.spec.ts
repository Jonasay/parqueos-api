import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadosService } from './empleados.service.js';
import { EMPLEADOS_REPOSITORY } from './repositories/empleados.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('EmpleadosService', () => {
  let service: EmpleadosService;

  const mockEmpleadosRepository = {
    crear: vi.fn(),
    buscarPorUsuarioId: vi.fn(),
    buscarPorDpi: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpleadosService,
        { provide: EMPLEADOS_REPOSITORY, useValue: mockEmpleadosRepository },
      ],
    }).compile();

    service = module.get<EmpleadosService>(EmpleadosService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe registrar un empleado si DPI y usuario están libres', async () => {
    mockEmpleadosRepository.buscarPorUsuarioId.mockResolvedValue(null);
    mockEmpleadosRepository.buscarPorDpi.mockResolvedValue(null);
    mockEmpleadosRepository.crear.mockResolvedValue({ id: 1, dpi: '123' });
    
    const result = await service.registrarEmpleado({ usuario_id: 1, dpi: '123' });
    expect(result).toHaveProperty('id');
    expect(mockEmpleadosRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException (422) si el usuario ya tiene perfil', async () => {
    mockEmpleadosRepository.buscarPorUsuarioId.mockResolvedValue({ id: 1 });
    await expect(service.registrarEmpleado({ usuario_id: 1, dpi: '123' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe lanzar UnprocessableEntityException (422) si el DPI ya existe', async () => {
    mockEmpleadosRepository.buscarPorUsuarioId.mockResolvedValue(null);
    mockEmpleadosRepository.buscarPorDpi.mockResolvedValue({ id: 2, dpi: '123' });
    await expect(service.registrarEmpleado({ usuario_id: 1, dpi: '123' })).rejects.toThrow(UnprocessableEntityException);
  });

  it('5. Debe lanzar NotFoundException (404) si el DPI buscado no existe', async () => {
    mockEmpleadosRepository.buscarPorDpi.mockResolvedValue(null);
    await expect(service.buscarPorDpi('999')).rejects.toThrow(NotFoundException);
  });
});