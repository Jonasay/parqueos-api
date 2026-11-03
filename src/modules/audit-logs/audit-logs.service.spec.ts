import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from './audit-logs.service.js';
import { AUDIT_LOGS_REPOSITORY } from './repositories/audit-logs.repository.interface.js';

describe('AuditLogsService', () => {
  let service: AuditLogsService;

  const mockAuditLogsRepository = {
    crear: vi.fn(),
    obtenerTodos: vi.fn(),
    buscarPorUsuario: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        { provide: AUDIT_LOGS_REPOSITORY, useValue: mockAuditLogsRepository },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
    vi.clearAllMocks();
  });

  it('1. Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('2. Debe registrar un nuevo log de auditoría exitosamente', async () => {
    mockAuditLogsRepository.crear.mockResolvedValue({ id: 1, accion: 'TEST' });
    const result = await service.registrarAccion({ usuario_id: 1, accion: 'TEST' });
    expect(result.id).toEqual(1);
    expect(mockAuditLogsRepository.crear).toHaveBeenCalled();
  });

  it('3. Debe obtener todos los registros del historial', async () => {
    mockAuditLogsRepository.obtenerTodos.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.obtenerHistorial();
    expect(result.length).toEqual(2);
  });

  it('4. Debe obtener registros filtrados por usuario', async () => {
    mockAuditLogsRepository.buscarPorUsuario.mockResolvedValue([{ id: 3, usuario_id: 5 }]);
    const result = await service.obtenerHistorialPorUsuario(5);
    expect(result[0].usuario_id).toEqual(5);
  });

  it('5. Debe retornar un arreglo vacío si el usuario no tiene registros', async () => {
    mockAuditLogsRepository.buscarPorUsuario.mockResolvedValue([]);
    const result = await service.obtenerHistorialPorUsuario(999);
    expect(result).toEqual([]);
  });
});