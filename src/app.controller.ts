import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  status: 'ok';
  service: string;
}

@Controller('health')
export class AppController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'control-del-carro-api',
    };
  }
}
