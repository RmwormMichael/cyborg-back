import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PERSONAS, Persona } from '../common/personas';
import { Jornada, JornadaDocument } from '../jornadas/schemas/jornada.schema';
import { ResumenQueryDto } from './dto/resumen-query.dto';
import { ResumenPersona, ResumenResponse } from './reportes.types';

interface JornadaParaResumen {
  persona: Persona;
  ingresos: {
    efectivo: number;
    uber: number;
  };
  gastos: Array<{
    valor: number;
  }>;
}

interface Acumulado {
  ingresosEfectivo: number;
  ingresosUber: number;
  gastosTotales: number;
  jornadas: number;
}

function crearAcumulado(): Acumulado {
  return {
    ingresosEfectivo: 0,
    ingresosUber: 0,
    gastosTotales: 0,
    jornadas: 0,
  };
}

function aResumenPersona(
  persona: Persona,
  acumulado: Acumulado,
): ResumenPersona {
  const ingresosTotales =
    acumulado.ingresosEfectivo + acumulado.ingresosUber;

  return {
    persona,
    ingresosEfectivo: acumulado.ingresosEfectivo,
    ingresosUber: acumulado.ingresosUber,
    ingresosTotales,
    gastosTotales: acumulado.gastosTotales,
    gananciaNeta: ingresosTotales - acumulado.gastosTotales,
    jornadas: acumulado.jornadas,
  };
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectModel(Jornada.name)
    private readonly jornadaModel: Model<JornadaDocument>,
  ) {}

  async obtenerResumen(query: ResumenQueryDto): Promise<ResumenResponse> {
    const { desde, hasta, persona } = query;

    if (desde > hasta) {
      throw new BadRequestException(
        'La fecha "desde" no puede ser posterior a la fecha "hasta".',
      );
    }

    const filtro = {
      fecha: { $gte: desde, $lte: hasta },
      ...(persona !== undefined ? { persona } : {}),
    };

    const jornadas = (await this.jornadaModel
      .find(filtro)
      .lean()
      .exec()) as unknown as JornadaParaResumen[];

    return this.calcularResumen(jornadas, desde, hasta, persona);
  }

  private calcularResumen(
    jornadas: JornadaParaResumen[],
    desde: string,
    hasta: string,
    persona?: Persona,
  ): ResumenResponse {
    const personas: Persona[] = persona ? [persona] : [...PERSONAS];
    const acumulados = new Map<Persona, Acumulado>(
      personas.map((actual) => [actual, crearAcumulado()]),
    );

    for (const jornada of jornadas) {
      const acumulado = acumulados.get(jornada.persona);

      if (!acumulado) {
        continue;
      }

      acumulado.ingresosEfectivo += jornada.ingresos.efectivo;
      acumulado.ingresosUber += jornada.ingresos.uber;
      acumulado.gastosTotales += jornada.gastos.reduce(
        (total, gasto) => total + gasto.valor,
        0,
      );
      acumulado.jornadas += 1;
    }

    const porPersona = personas.map((actual) =>
      aResumenPersona(actual, acumulados.get(actual) ?? crearAcumulado()),
    );

    const totales = porPersona.reduce(
      (total, parcial) => ({
        ingresosEfectivo: total.ingresosEfectivo + parcial.ingresosEfectivo,
        ingresosUber: total.ingresosUber + parcial.ingresosUber,
        ingresosTotales: total.ingresosTotales + parcial.ingresosTotales,
        gastosTotales: total.gastosTotales + parcial.gastosTotales,
        gananciaNeta: total.gananciaNeta + parcial.gananciaNeta,
        jornadas: total.jornadas + parcial.jornadas,
      }),
      {
        ingresosEfectivo: 0,
        ingresosUber: 0,
        ingresosTotales: 0,
        gastosTotales: 0,
        gananciaNeta: 0,
        jornadas: 0,
      },
    );

    return {
      desde,
      hasta,
      ...totales,
      porPersona,
    };
  }
}
