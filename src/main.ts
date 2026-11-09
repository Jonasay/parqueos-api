import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { validateEnvironmentConfiguration } from './config/environment.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  validateEnvironmentConfiguration();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());


  const config = new DocumentBuilder()
    .setTitle('API Parqueos UMES')
    .setDescription('Sistema de gestión y control de parqueos')
    .setVersion('1.0')
    .addServer('https://parqueos-api.onrender.com', 'Servidor Producción (Render)')
    .addServer('http://localhost:3000', 'Servidor Local')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'ApiKeyAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap().catch(() => {
  new Logger('Bootstrap').error(
    'Application startup failed. Check required environment variables and database connectivity.',
  );
  process.exitCode = 1;
});