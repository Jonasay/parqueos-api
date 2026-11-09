import { UnprocessableEntityException } from '@nestjs/common';
import { PrismaPagosRepository } from './prisma-pagos.repository.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

describe('PrismaPagosRepository', () => {
  const transaction = {
    ticket: { updateMany: vi.fn(), findUnique: vi.fn() },
    pago: { create: vi.fn() },
  };
  const prisma = {
    $transaction: vi.fn((callback: (tx: typeof transaction) => unknown) =>
      callback(transaction),
    ),
  };
  let repository: PrismaPagosRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PrismaPagosRepository(prisma as unknown as PrismaService);
  });

  it('creates payment only when it atomically changes a closed ticket to paid', async () => {
    transaction.ticket.updateMany.mockResolvedValue({ count: 1 });
    transaction.pago.create.mockResolvedValue({ id: 21, ticket_id: 3 });
    const data = { ticket_id: 3, total_pagado: 10, metodo_pago_id: 1 };

    await expect(repository.registrarPagoYMarcarTicketComoPagado(data)).resolves.toEqual({
      id: 21,
      ticket_id: 3,
    });

    expect(transaction.ticket.updateMany).toHaveBeenCalledWith({
      where: { id: 3, estado: 'FINALIZADO' },
      data: { estado: 'PAGADO' },
    });
    expect(transaction.pago.create).toHaveBeenCalledWith({ data });
  });

  it('rejects a repeated payment without creating another payment record', async () => {
    transaction.ticket.updateMany.mockResolvedValue({ count: 0 });
    transaction.ticket.findUnique.mockResolvedValue({ id: 3, estado: 'PAGADO' });

    await expect(
      repository.registrarPagoYMarcarTicketComoPagado({
        ticket_id: 3,
        total_pagado: 10,
        metodo_pago_id: 1,
      }),
    ).rejects.toThrow(UnprocessableEntityException);
    expect(transaction.pago.create).not.toHaveBeenCalled();
  });
});
