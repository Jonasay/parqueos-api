import { Test, TestingModule } from '@nestjs/testing';
import { TarifasService } from './tarifas.service.js';
import { TARIFAS_REPOSITORY } from './repositories/tarifas.repository.interface.js';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('TarifasService', () => {
  let service: TarifasService;

  const mockTarifasRepository = {
    crear: vi.fn(),
    buscarPorTipoVehiculo: vi.fn(),
    obtenerTodas: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarifasService,
        { provide: TARIFAS_REPOSITORY, useValue: mockTarifasRepository },
      ],
    }).compile();

    service = module.get<TarifasService>(TarifasService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe crear una tarifa si no hay otra activa para ese vehículo', async () => {
    mockTarifasRepository.buscarPorTipoVehiculo.mockResolvedValue(null);
    mockTarifasRepository.crear.mockResolvedValue({ id: 1, tipo_vehiculo_id: 2 });
    
    const result = await service.registrarTarifa({ tipo_vehiculo_id: 2, monto_por_hora: 15 });
    expect(result).toHaveProperty('id');
    expect(mockTarifasRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe lanzar UnprocessableEntityException si ya existe tarifa activa', async () => {
    mockTarifasRepository.buscarPorTipoVehiculo.mockResolvedValue({ id: 1 });
    await expect(service.registrarTarifa({ tipo_vehiculo_id: 2 })).rejects.toThrow(UnprocessableEntityException);
  });

  it('4. Debe retornar una tarifa si el vehículo tiene configuración activa', async () => {
    mockTarifasRepository.buscarPorTipoVehiculo.mockResolvedValue({ id: 5, monto_por_hora: 10 });
    const result = await service.buscarTarifaActiva(2);
    expect(result.id).toEqual(5);
  });

  it('5. Debe lanzar NotFoundException si no encuentra tarifa activa', async () => {
    mockTarifasRepository.buscarPorTipoVehiculo.mockResolvedValue(null);
    await expect(service.buscarTarifaActiva(99)).rejects.toThrow(NotFoundException);
  });
});
