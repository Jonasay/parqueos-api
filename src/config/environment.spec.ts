import { InternalServerErrorException } from '@nestjs/common';
import { validateEnvironmentConfiguration } from './environment.js';

const validEnvironment = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://localhost:5432/parqueos',
  EXTERNAL_API_URL: 'https://auth.example.test',
  EXTERNAL_API_KEY: 'test-key',
  JWT_SECRET: 'test-secret-with-at-least-thirty-two-characters',
};

describe('validateEnvironmentConfiguration', () => {
  it('accepts a complete production environment', () => {
    expect(() => validateEnvironmentConfiguration(validEnvironment)).not.toThrow();
  });

  it('requires JWT_SECRET in production', () => {
    const { JWT_SECRET: _secret, ...environment } = validEnvironment;

    expect(() => validateEnvironmentConfiguration(environment)).toThrow(
      InternalServerErrorException,
    );
  });

  it('rejects missing server integration settings', () => {
    const { EXTERNAL_API_KEY: _apiKey, ...environment } = validEnvironment;

    expect(() => validateEnvironmentConfiguration(environment)).toThrow(
      InternalServerErrorException,
    );
  });
});
