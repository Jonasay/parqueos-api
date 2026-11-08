import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Error interno del servidor';

    // 1. Manejo de Excepciones HTTP de NestJS 
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || exceptionResponse;
    } 
    // 2. Manejo de Errores del ORM (Prisma) 
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errorPrisma = exception as Prisma.PrismaClientKnownRequestError;
      if (errorPrisma.code === 'P2002') {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'El registro ya existe (Violación de restricción única).';
      } else if (errorPrisma.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Registro no encontrado en la base de datos.';
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const details = exception instanceof Error
        ? `${exception.name}: ${exception.message}`
        : String(exception);
      this.logger.error(
        `${request.method} ${request.originalUrl} failed: ${details}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}