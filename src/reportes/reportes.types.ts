import { Persona } from '../common/personas';

export interface ResumenPersona {
  persona: Persona;
  ingresosEfectivo: number;
  ingresosUber: number;
  ingresosTotales: number;
  gastosTotales: number;
  gananciaNeta: number;
  jornadas: number;
}

export interface ResumenResponse {
  desde: string;
  hasta: string;
  ingresosEfectivo: number;
  ingresosUber: number;
  ingresosTotales: number;
  gastosTotales: number;
  gananciaNeta: number;
  jornadas: number;
  porPersona: ResumenPersona[];
}
