import { CreateJornadaDto } from './dto/create-jornada.dto';
import { FechaParamDto } from './dto/fecha-param.dto';
import { MesQueryDto } from './dto/mes-query.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { JornadasService } from './jornadas.service';
import { JornadaResponse } from './jornadas.types';
export declare class JornadasController {
    private readonly jornadasService;
    constructor(jornadasService: JornadasService);
    listarPorMes({ mes }: MesQueryDto): Promise<JornadaResponse[]>;
    obtenerPorFecha({ fecha }: FechaParamDto): Promise<JornadaResponse>;
    crear(dto: CreateJornadaDto): Promise<JornadaResponse>;
    actualizar({ fecha }: FechaParamDto, dto: UpdateJornadaDto): Promise<JornadaResponse>;
    eliminar({ fecha }: FechaParamDto): Promise<void>;
}
