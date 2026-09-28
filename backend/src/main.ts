import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { corsOrigin } from './common/cors';

const REQUIRED_ENV = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

async function bootstrap() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing required env vars: ${missing.join(', ')}`);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  // Behind Railway's proxy: use X-Forwarded-For so rate limits apply per client,
  // not to the proxy address shared by every user
  app.set('trust proxy', 1);

  app.enableCors({ origin: corsOrigin, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Fast health endpoint outside the /api prefix for Railway healthcheck
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req: any, res: any) => res.status(200).json({ status: 'ok' }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}

bootstrap();
