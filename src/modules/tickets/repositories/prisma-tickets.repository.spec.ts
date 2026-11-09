import { ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaTicketsRepository } from './prisma-tickets.repository.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

describe('PrismaTicketsRepository', () => {
  const transaction = {
    empleado: { findUnique: vi.fn() },
    vehiculo: { findUnique: vi.fn() },
    espacioParqueo: { findUnique: vi.fn(), updateMany: vi.fn(), update: vi.fn() },
    estadoEspacio: { findMany: vi.fn() },
    ticket: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      updateMany: vi.fn(),
    },
  };
  const prisma = {
    $transaction: vi.fn((callback: (tx: typeof transaction) => unknown) =>
      callback(transaction),
    ),
  };
  let repository: PrismaTicketsRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PrismaTicketsRepository(prisma as unknown as PrismaService);
    transaction.empleado.findUnique.mockResolvedValue({ id: 4, activo: true });
    transaction.vehiculo.findUnique.mockResolvedValue({ id: 7, placa: 'P-123ABC', activo: true });
    transaction.espacioParqueo.findUnique.mockResolvedValue({
      id: 5,
      activo: true,
      estado_id: 1,
      estado: { id: 1, nombre: 'DISPONIBLE' },
    });
    transaction.estadoEspacio.findMany.mockResolvedValue([
      { id: 1, nombre: 'DISPONIBLE', activo: true },
      { id: 2, nombre: 'OCUPADO', activo: true },
    ]);
    transaction.espacioParqueo.updateMany.mockResolvedValue({ count: 1 });
    transaction.ticket.create.mockResolvedValue({
      id: 12,
      codigo_ticket: 'ticket-code',
      vehiculo_id: 7,
      espacio_id: 5,
      hora_entrada: new Date(),
      hora_salida: null,
      empleado_ingreso_id: 4,
      estado: 'ACTIVO',
      activo: true,
      vehiculo: { id: 7, placa: 'P-123ABC' },
      espacio: { id: 5 },
    });
  });

  it('rechaza al usuario sin un perfil activo de empleado', async () => {
    transaction.empleado.findUnique.mockResolvedValue({ id: 4, activo: false });

    await expect(
      repository.registrarEntrada({ placa: 'P-123ABC', espacioId: 5, usuarioId: 9 }),
    ).rejects.toThrow(ForbiddenException);
    expect(transaction.ticket.create).not.toHaveBeenCalled();
  });

  it('rechaza un vehículo inexistente sin crear un ticket', async () => {
    transaction.vehiculo.findUnique.mockResolvedValue(null);

    await expect(
      repository.registrarEntrada({ placa: 'P-123ABC', espacioId: 5, usuarioId: 9 }),
    ).rejects.toThrow(NotFoundException);
    expect(transaction.ticket.create).not.toHaveBeenCalled();
  });

  it('rechaza un espacio ocupado sin crear un ticket', async () => {
    transaction.espacioParqueo.findUnique.mockResolvedValue({
      id: 5,
      activo: true,
      estado_id: 2,
      estado: { id: 2, nombre: 'OCUPADO' },
    });

    await expect(
      repository.registrarEntrada({ placa: 'P-123ABC', espacioId: 5, usuarioId: 9 }),
    ).rejects.toThrow(UnprocessableEntityException);
    expect(transaction.espacioParqueo.updateMany).not.toHaveBeenCalled();
    expect(transaction.ticket.create).not.toHaveBeenCalled();
  });

  it('reserva el espacio y crea un ticket coherente en una transacción', async () => {
    await expect(
      repository.registrarEntrada({ placa: 'P-123ABC', espacioId: 5, usuarioId: 9 }),
    ).resolves.toMatchObject({
      codigo_ticket: 'ticket-code',
      vehiculo: { placa: 'P-123ABC' },
      espacio_id: 5,
    });

    expect(prisma.$transaction).toHaveBeenCalledOnce();
    expect(transaction.espacioParqueo.updateMany).toHaveBeenCalledWith({
      where: { id: 5, activo: true, estado_id: 1 },
      data: { estado_id: 2 },
    });
    expect(transaction.ticket.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          vehiculo_id: 7,
          espacio_id: 5,
          empleado_ingreso_id: 4,
          estado: 'ACTIVO',
        }),
        include: { vehiculo: true, espacio: true },
      }),
    );
  });

  it('cierra una sola vez el ticket y libera el espacio en la misma transacción', async () => {
    const activeTicket = {
      id: 12,
      espacio_id: 5,
      estado: 'ACTIVO',
      vehiculo: { placa: 'P-123ABC' },
      espacio: { id: 5 },
    };
    transaction.ticket.findUnique.mockResolvedValue(activeTicket);
    transaction.estadoEspacio.findMany.mockResolvedValue([
      { id: 1, nombre: 'disponible', activo: true },
    ]);
    transaction.ticket.updateMany.mockResolvedValue({ count: 1 });
    transaction.ticket.findUniqueOrThrow.mockResolvedValue({
      ...activeTicket,
      estado: 'FINALIZADO',
    });

    await expect(repository.actualizarSalida(12, new Date())).resolves.toMatchObject({
      estado: 'FINALIZADO',
    });

    expect(transaction.ticket.updateMany).toHaveBeenCalledWith({
      where: { id: 12, estado: 'ACTIVO' },
      data: expect.objectContaining({ estado: 'FINALIZADO' }),
    });
    expect(transaction.espacioParqueo.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { estado_id: 1 },
    });
  });

  it('no vuelve a procesar un ticket ya cerrado', async () => {
    transaction.ticket.findUnique.mockResolvedValue({
      id: 12,
      estado: 'FINALIZADO',
      espacio_id: 5,
    });

    await expect(repository.actualizarSalida(12, new Date())).rejects.toThrow(
      UnprocessableEntityException,
    );
    expect(transaction.ticket.updateMany).not.toHaveBeenCalled();
    expect(transaction.espacioParqueo.update).not.toHaveBeenCalled();
  });
});
