import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service.js';
import { CLIENTES_REPOSITORY } from './repositories/clientes.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('ClientesService', () => {
  let service: ClientesService;

  const mockClientesRepository = {
    crear: vi.fn(),
    buscarPorUsuarioId: vi.fn(),
    obtenerTodos: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        { provide: CLIENTES_REPOSITORY, useValue: mockClientesRepository },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe registrar un cliente si no existe previamente', async () => {
    mockClientesRepository.buscarPorUsuarioId.mockResolvedValue(null);
    mockClientesRepository.crear.mockResolvedValue({ id: 1, usuario_id: 2 });
    
    const result = await service.registrarCliente({ usuario_id: 2 });
    expect(result).toHaveProperty('id');
    expect(mockClientesRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si el cliente ya existe', async () => {
    mockClientesRepository.buscarPorUsuarioId.mockResolvedValue({ id: 1, usuario_id: 2 });
    
    await expect(service.registrarCliente({ usuario_id: 2 })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar un cliente si el usuario_id existe', async () => {
    mockClientesRepository.buscarPorUsuarioId.mockResolvedValue({ id: 5, usuario_id: 10 });
    const result = await service.buscarPorUsuarioId(10);
    expect(result.id).toEqual(5);
  });

  it('5. Debe lanzar NotFoundException si el cliente no se encuentra', async () => {
    mockClientesRepository.buscarPorUsuarioId.mockResolvedValue(null);
    await expect(service.buscarPorUsuarioId(999)).rejects.toThrow(NotFoundException);
  });
});