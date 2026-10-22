import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurarAplicacion } from './app.setup';

config({ quiet: true });

const DEFAULT_PORT = 3000;
const HOST = '0.0.0.0';

async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Puerto inválido: ${process.env.PORT}`);
  }

  const app = await NestFactory.create(AppModule);
  configurarAplicacion(app);

  await app.listen(port, HOST);
  console.log(
    `API de Control del Carro disponible en http://${HOST}:${port}/api`,
  );
}

void bootstrap();
