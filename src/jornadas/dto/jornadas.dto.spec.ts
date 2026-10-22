import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateJornadaDto } from './create-jornada.dto';
import { UpdateJornadaDto } from './update-jornada.dto';

const OPCIONES = { whitelist: true, forbidNonWhitelisted: true };

function crearJornadaValida(): Record<string, unknown> {
  return {
    fecha: '2026-10-20',
    persona: 'papa',
    ingresos: { efectivo: 120000, uber: 80000 },
    gastos: [{ concepto: 'Combustible', valor: 30000 }],
    observaciones: 'Jornada normal',
  };
}

async function validar<T extends object>(
  clase: new () => T,
  datos: unknown,
): Promise<ValidationError[]> {
  const instancia = plainToInstance(clase, datos);
  return validate(instancia, OPCIONES);
}

function propiedadesConError(errores: ValidationError[]): string[] {
  return errores.map((error) => error.property);
}

describe('CreateJornadaDto', () => {
  it('acepta una jornada válida', async () => {
    const errores = await validar(CreateJornadaDto, crearJornadaValida());

    expect(errores).toHaveLength(0);
  });

  it('acepta el valor interno hermano para Jeisson', async () => {
    const datos = crearJornadaValida();
    datos.persona = 'hermano';

    const errores = await validar(CreateJornadaDto, datos);

    expect(errores).toHaveLength(0);
  });

  it('recorta espacios en conceptos y observaciones', async () => {
    const datos = crearJornadaValida();
    datos.gastos = [{ concepto: '  Combustible  ', valor: 30000 }];
    datos.observaciones = '  Jornada normal  ';

    const instancia = plainToInstance(
      CreateJornadaDto,
      datos,
    ) as CreateJornadaDto;

    expect(instancia.gastos[0].concepto).toBe('Combustible');
    expect(instancia.observaciones).toBe('Jornada normal');
  });

  it('rechaza una fecha de calendario inexistente', async () => {
    const datos = crearJornadaValida();
    datos.fecha = '2026-02-30';

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('fecha');
  });

  it('rechaza una fecha con formato incorrecto', async () => {
    const datos = crearJornadaValida();
    datos.fecha = '20-10-2026';

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('fecha');
  });

  it('rechaza ingresos negativos', async () => {
    const datos = crearJornadaValida();
    datos.ingresos = { efectivo: -1, uber: 80000 };

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('ingresos');
  });

  it('rechaza importes no enteros', async () => {
    const datos = crearJornadaValida();
    datos.gastos = [{ concepto: 'Combustible', valor: 1000.5 }];

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('gastos');
  });

  it('rechaza conceptos vacíos', async () => {
    const datos = crearJornadaValida();
    datos.gastos = [{ concepto: '   ', valor: 1000 }];

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('gastos');
  });

  it('rechaza personas no permitidas', async () => {
    const datos = crearJornadaValida();
    datos.persona = 'madre';

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('persona');
  });

  it('rechaza personas nulas', async () => {
    const datos = crearJornadaValida();
    datos.persona = null;

    const errores = await validar(CreateJornadaDto, datos);

    expect(propiedadesConError(errores)).toContain('persona');
  });
});

describe('UpdateJornadaDto', () => {
  it('acepta una edición parcial', async () => {
    const errores = await validar(UpdateJornadaDto, {
      observaciones: 'Cambió la ruta',
    });

    expect(errores).toHaveLength(0);
  });

  it('rechaza una fecha nueva en el cuerpo', async () => {
    const errores = await validar(UpdateJornadaDto, {
      fecha: '2026-10-21',
      observaciones: 'Intento de cambio de identidad',
    });

    expect(propiedadesConError(errores)).toContain('fecha');
  });

  it('rechaza un identificador de gasto inválido', async () => {
    const errores = await validar(UpdateJornadaDto, {
      gastos: [{ id: 'no-es-uuid', concepto: 'Peaje', valor: 12000 }],
    });

    expect(propiedadesConError(errores)).toContain('gastos');
  });

  it('acepta gastos nuevos sin identificador y existentes con UUID', async () => {
    const errores = await validar(UpdateJornadaDto, {
      gastos: [
        {
          id: '11111111-1111-4111-8111-111111111111',
          concepto: 'Combustible',
          valor: 30000,
        },
        { concepto: 'Peaje', valor: 12000 },
      ],
    });

    expect(errores).toHaveLength(0);
  });
});
