import { ArgumentsHost, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter.js';

describe('GlobalExceptionFilter', () => {
  it('logs unexpected errors without exposing details to the client', () => {
    const loggerError = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const request = { method: 'GET', originalUrl: '/api/clientes' };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost;

    new GlobalExceptionFilter().catch(new Error('database relation missing'), host);

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/clientes failed: Error: database relation missing'),
      expect.any(String),
    );
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 500,
      message: 'Error interno del servidor',
    }));

    loggerError.mockRestore();
  });
});
