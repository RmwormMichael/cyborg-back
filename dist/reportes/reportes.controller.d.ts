import { ResumenQueryDto } from './dto/resumen-query.dto';
import { ReportesService } from './reportes.service';
import { ResumenResponse } from './reportes.types';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    obtenerResumen(query: ResumenQueryDto): Promise<ResumenResponse>;
}
