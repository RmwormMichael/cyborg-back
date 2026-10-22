import { INestApplication, ValidationPipe } from '@nestjs/common';

const DEFAULT_FRONTEND_ORIGINS = ['http://127.0.0.1:5173'];

function obtenerOrigenesPermitidos(): string[] {
  const configurados = (process.env.FRONTEND_ORIGIN ?? '')
    .split(',')
    .map((origen) => origen.trim().replace(/\/+$/, ''))
    .filter((origen) => origen.length > 0);

  return configurados.length > 0
    ? configurados
    : DEFAULT_FRONTEND_ORIGINS;
}

export function configurarAplicacion(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: obtenerOrigenesPermitidos(),
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
