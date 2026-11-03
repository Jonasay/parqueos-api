import { Test, TestingModule } from '@nestjs/testing';
import { EspaciosService } from './espacios.service.js';
import { ESPACIOS_REPOSITORY } from './repositories/espacios.repository.interface.js';
import { NotFoundException } from '@nestjs/common';

describe('EspaciosService', () => {
  let service: EspaciosService;
  
  const mockEspaciosRepository = {
    crear: vi.fn(),
    obtenerDisponibles: vi.fn(),
    buscarPorId: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspaciosService,
        { provide: ESPACIOS_REPOSITORY, useValue: mockEspaciosRepository },
      ],
    }).compile();

    service = module.get<EspaciosService>(EspaciosService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear un espacio exitosamente', async () => {
    const dto = { nivel_id: 1, estado_id: 1, tipo_vehiculo_id: 1, es_techado: true };
    mockEspaciosRepository.crear.mockResolvedValue({ id: 1, ...dto });
    const result = await service.crearEspacio(dto);
    expect(result).toHaveProperty('id');
    expect(mockEspaciosRepository.crear).toHaveBeenCalledWith(dto);
  });

  it('3. Debe retornar lista de espacios disponibles', async () => {
    mockEspaciosRepository.obtenerDisponibles.mockResolvedValue([{ id: 1, estado_id: 1 }]);
    const result = await service.consultarDisponibles();
    expect(result.length).toBeGreaterThan(0);
    expect(mockEspaciosRepository.obtenerDisponibles).toHaveBeenCalled();
  });

  it('4. Debe retornar un espacio si el ID existe', async () => {
    mockEspaciosRepository.buscarPorId.mockResolvedValue({ id: 5 });
    const result = await service.buscarPorId(5);
    expect(result.id).toEqual(5);
  });

  it('5. Debe lanzar NotFoundException (404) si el ID no existe', async () => {
    mockEspaciosRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
  });
});