import { InternalServerErrorException } from '@nestjs/common';

export function validateEnvironmentConfiguration(
  environment: NodeJS.ProcessEnv = process.env,
): void {
  const required = ['DATABASE_URL', 'EXTERNAL_API_URL', 'EXTERNAL_API_KEY'];
  const missing = required.filter((name) => !environment[name]?.trim());
  if (environment.NODE_ENV === 'production' && !environment.JWT_SECRET?.trim()) {
    missing.push('JWT_SECRET');
  }
  if (missing.length) {
    throw new InternalServerErrorException(
      `Faltan variables de entorno requeridas: ${missing.join(', ')}.`,
    );
  }

  try {
    const databaseUrl = new URL(environment.DATABASE_URL!);
    if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new InternalServerErrorException('DATABASE_URL debe ser una URL PostgreSQL válida.');
  }

  try {
    const externalUrl = new URL(environment.EXTERNAL_API_URL!);
    if (!['http:', 'https:'].includes(externalUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new InternalServerErrorException('EXTERNAL_API_URL debe ser una URL HTTP o HTTPS válida.');
  }

  const jwtSecret = environment.JWT_SECRET?.trim();
  if (!jwtSecret) {
    throw new InternalServerErrorException('Falta configurar JWT_SECRET.');
  }
  if (environment.NODE_ENV === 'production' && jwtSecret.length < 32) {
    throw new InternalServerErrorException(
      'JWT_SECRET debe tener al menos 32 caracteres en producción.',
    );
  }
}
