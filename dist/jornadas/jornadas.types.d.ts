import { Persona } from '../common/personas';
export interface GastoResponse {
    id: string;
    concepto: string;
    valor: number;
}
export interface JornadaResponse {
    fecha: string;
    persona: Persona;
    ingresos: {
        efectivo: number;
        uber: number;
    };
    gastos: GastoResponse[];
    observaciones?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface JornadaPersistida {
    fecha: string;
    persona: Persona;
    ingresos: {
        efectivo: number;
        uber: number;
    };
    gastos: GastoResponse[];
    observaciones?: string;
    createdAt: Date;
    updatedAt: Date;
}
