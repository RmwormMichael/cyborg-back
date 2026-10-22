import { Controller, Get, Query } from '@nestjs/common';
import { ResumenQueryDto } from './dto/resumen-query.dto';
import { ReportesService } from './reportes.service';
import { ResumenResponse } from './reportes.types';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('resumen')
  obtenerResumen(@Query() query: ResumenQueryDto): Promise<ResumenResponse> {
    return this.reportesService.obtenerResumen(query);
  }
}
