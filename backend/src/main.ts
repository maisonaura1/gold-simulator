import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://goldtradermt.app',
    'https://www.goldtradermt.app',
    'https://frontend-eight-phi-90.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const isElectron = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin);
      const isAllowed = isElectron || allowedOrigins.includes(origin);
      cb(isAllowed ? null : new Error(`CORS blocked: ${origin}`), isAllowed);
    },
    credentials: true,
  });

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
