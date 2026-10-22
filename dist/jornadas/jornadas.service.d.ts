import { Model } from 'mongoose';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { JornadaDocument } from './schemas/jornada.schema';
import { JornadaResponse } from './jornadas.types';
export declare class JornadasService {
    private readonly jornadaModel;
    constructor(jornadaModel: Model<JornadaDocument>);
    crear(dto: CreateJornadaDto): Promise<JornadaResponse>;
    listarPorMes(mes: string): Promise<JornadaResponse[]>;
    obtenerPorFecha(fecha: string): Promise<JornadaResponse>;
    actualizar(fecha: string, dto: UpdateJornadaDto): Promise<JornadaResponse>;
    eliminar(fecha: string): Promise<void>;
    private reemplazarGastos;
    private aRespuesta;
}
