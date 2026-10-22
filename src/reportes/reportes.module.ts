import { Module } from '@nestjs/common';
import { JornadasModule } from '../jornadas/jornadas.module';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({
  imports: [JornadasModule],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
