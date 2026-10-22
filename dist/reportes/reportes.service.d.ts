import { Model } from 'mongoose';
import { JornadaDocument } from '../jornadas/schemas/jornada.schema';
import { ResumenQueryDto } from './dto/resumen-query.dto';
import { ResumenResponse } from './reportes.types';
export declare class ReportesService {
    private readonly jornadaModel;
    constructor(jornadaModel: Model<JornadaDocument>);
    obtenerResumen(query: ResumenQueryDto): Promise<ResumenResponse>;
    private calcularResumen;
}
