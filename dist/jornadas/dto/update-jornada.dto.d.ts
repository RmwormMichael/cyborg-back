import { Persona } from '../../common/personas';
import { UpdateGastoDto } from './update-gasto.dto';
import { UpdateIngresosDto } from './update-ingresos.dto';
export declare class UpdateJornadaDto {
    persona?: Persona;
    ingresos?: UpdateIngresosDto;
    gastos?: UpdateGastoDto[];
    observaciones?: string;
}
