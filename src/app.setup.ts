import { INestApplication, ValidationPipe } from '@nestjs/common';

const DEFAULT_FRONTEND_ORIGIN = 'http://127.0.0.1:5173';

export function configurarAplicacion(app: INestApplication): void {
  const frontendOrigin = (
    process.env.FRONTEND_ORIGIN ?? DEFAULT_FRONTEND_ORIGIN
  ).replace(/\/+$/, '');

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [frontendOrigin],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
