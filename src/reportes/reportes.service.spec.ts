import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Persona } from '../common/personas';
import { Jornada, JornadaDocument } from '../jornadas/schemas/jornada.schema';
import { ReportesService } from './reportes.service';

interface DocumentoResumen {
  persona: Persona;
  ingresos: { efectivo: number; uber: number };
  gastos: Array<{ valor: number }>;
}

interface ModeloMock {
  find: jest.Mock;
}

function crearModelo(documentos: DocumentoResumen[]): ModeloMock {
  const exec = jest.fn().mockResolvedValue(documentos);
  const lean = jest.fn().mockReturnValue({ exec });
  const find = jest.fn().mockReturnValue({ lean });

  return { find };
}

function crearServicio(modelo: ModeloMock): ReportesService {
  return new ReportesService(
    modelo as unknown as Model<JornadaDocument>,
  );
}

function documento(
  persona: Persona,
  efectivo: number,
  uber: number,
  gastos: number[],
): DocumentoResumen {
  return {
    persona,
    ingresos: { efectivo, uber },
    gastos: gastos.map((valor) => ({ valor })),
  };
}

describe('ReportesService', () => {
  it('calcula totales y ganancia neta con ambos conductores', async () => {
    const modelo = crearModelo([
      documento('papa', 100000, 50000, [20000]),
      documento('papa', 200000, 100000, [30000]),
      documento('hermano', 50000, 25000, [10000]),
    ]);
    const servicio = crearServicio(modelo);

    const resumen = await servicio.obtenerResumen({
      desde: '2026-10-01',
      hasta: '2026-10-31',
    });

    expect(resumen.ingresosEfectivo).toBe(350000);
    expect(resumen.ingresosUber).toBe(175000);
    expect(resumen.ingresosTotales).toBe(525000);
    expect(resumen.gastosTotales).toBe(60000);
    expect(resumen.gananciaNeta).toBe(465000);
    expect(resumen.jornadas).toBe(3);
    expect(resumen.porPersona).toEqual([
      {
        persona: 'papa',
        ingresosEfectivo: 300000,
        ingresosUber: 150000,
        ingresosTotales: 450000,
        gastosTotales: 50000,
        gananciaNeta: 400000,
        jornadas: 2,
      },
      {
        persona: 'hermano',
        ingresosEfectivo: 50000,
        ingresosUber: 25000,
        ingresosTotales: 75000,
        gastosTotales: 10000,
        gananciaNeta: 65000,
        jornadas: 1,
      },
    ]);
  });

  it('consulta el rango con extremos inclusivos y sin filtro de persona', async () => {
    const modelo = crearModelo([]);
    const servicio = crearServicio(modelo);

    await servicio.obtenerResumen({
      desde: '2026-10-01',
      hasta: '2026-10-31',
    });

    const filtro = modelo.find.mock.calls[0][0] as Record<string, unknown>;
    expect(filtro.fecha).toEqual({ $gte: '2026-10-01', $lte: '2026-10-31' });
    expect(filtro).not.toHaveProperty('persona');
  });

  it('incluye a ambos conductores aunque no tengan jornadas', async () => {
    const modelo = crearModelo([documento('papa', 100000, 0, [])]);
    const servicio = crearServicio(modelo);

    const resumen = await servicio.obtenerResumen({
      desde: '2026-10-01',
      hasta: '2026-10-31',
    });

    expect(resumen.porPersona.map((item) => item.persona)).toEqual([
      'papa',
      'hermano',
    ]);
    expect(resumen.porPersona[1]).toEqual({
      persona: 'hermano',
      ingresosEfectivo: 0,
      ingresosUber: 0,
      ingresosTotales: 0,
      gastosTotales: 0,
      gananciaNeta: 0,
      jornadas: 0,
    });
  });

  it('filtra por persona cuando se envía el parámetro', async () => {
    const modelo = crearModelo([documento('hermano', 50000, 25000, [10000])]);
    const servicio = crearServicio(modelo);

    const resumen = await servicio.obtenerResumen({
      desde: '2026-10-01',
      hasta: '2026-10-31',
      persona: 'hermano',
    });

    const filtro = modelo.find.mock.calls[0][0] as Record<string, unknown>;
    expect(filtro.persona).toBe('hermano');
    expect(resumen.porPersona).toHaveLength(1);
    expect(resumen.gananciaNeta).toBe(65000);
  });

  it('rechaza un rango invertido sin consultar la base de datos', async () => {
    const modelo = crearModelo([]);
    const servicio = crearServicio(modelo);

    await expect(
      servicio.obtenerResumen({
        desde: '2026-10-31',
        hasta: '2026-10-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(modelo.find).not.toHaveBeenCalled();
  });
});
