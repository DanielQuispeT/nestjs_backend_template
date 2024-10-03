import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(express.json({ limit: '5mb' }));
  app.enableCors({
    origin: [process.env.FRONTEND_URL_ADMIN, process.env.FRONTEND_URL_CLIENT],
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'DELETE'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Apollo-Require-Preflight',
      'access-control-allow-origin',
      'X-Filename',
    ], // Ajusta esta lista según tus necesidades
  });
  await app.listen(process.env.PORT);
}
bootstrap();
