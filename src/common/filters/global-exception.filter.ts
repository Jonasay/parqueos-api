import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
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

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}