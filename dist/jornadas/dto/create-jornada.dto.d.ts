import { Persona } from '../../common/personas';
import { CreateGastoDto } from './create-gasto.dto';
import { CreateIngresosDto } from './create-ingresos.dto';
export declare class CreateJornadaDto {
    fecha: string;
    persona: Persona;
    ingresos: CreateIngresosDto;
    gastos: CreateGastoDto[];
    observaciones?: string;
}
