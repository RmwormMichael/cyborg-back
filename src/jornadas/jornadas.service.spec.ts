import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { JornadasService } from './jornadas.service';
import { JornadaPersistida } from './jornadas.types';
import { Jornada, JornadaDocument } from './schemas/jornada.schema';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const ID_A = '11111111-1111-4111-8111-111111111111';
const ID_B = '22222222-2222-4222-8222-222222222222';

interface ModeloMock {
  create: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  deleteOne: jest.Mock;
}

function crearModelo(): ModeloMock {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    deleteOne: jest.fn(),
  };
}

function crearServicio(modelo: ModeloMock): JornadasService {
  return new JornadasService(modelo as unknown as Model<JornadaDocument>);
}

function crearPersistida(
  overrides: Partial<JornadaPersistida> = {},
): JornadaPersistida {
  const fecha = new Date('2026-10-20T12:00:00.000Z');

  return {
    fecha: '2026-10-20',
    persona: 'papa',
    ingresos: { efectivo: 120000, uber: 80000 },
    gastos: [{ id: ID_A, concepto: 'Combustible', valor: 30000 }],
    observaciones: 'Jornada normal',
    createdAt: fecha,
    updatedAt: fecha,
    ...overrides,
  };
}

function crearJornadaDto(): CreateJornadaDto {
  return {
    fecha: '2026-10-20',
    persona: 'papa',
    ingresos: { efectivo: 120000, uber: 80000 },
    gastos: [
      { concepto: ' Combustible ', valor: 30000 },
      { concepto: 'Lavado', valor: 10000 },
    ],
    observaciones: ' Jornada normal ',
  };
}

describe('JornadasService', () => {
  describe('crear', () => {
    it('crea la jornada con identificadores generados y textos recortados', async () => {
      const modelo = crearModelo();
      modelo.create.mockImplementation((datos: JornadaPersistida) =>
        Promise.resolve({ ...datos, createdAt: new Date(), updatedAt: new Date() }),
      );
      const servicio = crearServicio(modelo);

      const respuesta = await servicio.crear(crearJornadaDto());
      const datosEnviados = modelo.create.mock.calls[0][0] as {
        gastos: Array<{ id: string; concepto: string }>;
        observaciones?: string;
      };

      expect(modelo.create).toHaveBeenCalledTimes(1);
      expect(datosEnviados.gastos).toHaveLength(2);
      expect(datosEnviados.gastos[0].id).toMatch(UUID_V4);
      expect(datosEnviados.gastos[1].id).toMatch(UUID_V4);
      expect(datosEnviados.gastos[0].id).not.toBe(datosEnviados.gastos[1].id);
      expect(datosEnviados.gastos[0].concepto).toBe('Combustible');
      expect(datosEnviados.observaciones).toBe('Jornada normal');
      expect(respuesta.gastos).toHaveLength(2);
      expect(respuesta.fecha).toBe('2026-10-20');
    });

    it('responde 409 cuando la fecha ya existe', async () => {
      const modelo = crearModelo();
      modelo.create.mockRejectedValue({ code: 11000 });
      const servicio = crearServicio(modelo);

      await expect(servicio.crear(crearJornadaDto())).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('propaga otros errores sin transformarlos', async () => {
      const modelo = crearModelo();
      modelo.create.mockRejectedValue(new Error('fallo inesperado'));
      const servicio = crearServicio(modelo);

      await expect(servicio.crear(crearJornadaDto())).rejects.toThrow(
        'fallo inesperado',
      );
    });
  });

  describe('listarPorMes', () => {
    it('consulta el mes completo con extremos inclusivos y ordena por fecha', async () => {
      const modelo = crearModelo();
      const exec = jest.fn().mockResolvedValue([crearPersistida()]);
      const sort = jest.fn().mockReturnValue({ exec });
      const find = jest.fn().mockReturnValue({ sort });
      modelo.find = find;
      const servicio = crearServicio(modelo);

      const respuesta = await servicio.listarPorMes('2026-10');

      expect(find).toHaveBeenCalledWith({
        fecha: { $gte: '2026-10-01', $lte: '2026-10-31' },
      });
      expect(sort).toHaveBeenCalledWith({ fecha: 1 });
      expect(respuesta).toHaveLength(1);
      expect(respuesta[0].fecha).toBe('2026-10-20');
    });

    it('calcula correctamente el último día de febrero', async () => {
      const modelo = crearModelo();
      const exec = jest.fn().mockResolvedValue([]);
      const sort = jest.fn().mockReturnValue({ exec });
      const find = jest.fn().mockReturnValue({ sort });
      modelo.find = find;
      const servicio = crearServicio(modelo);

      await servicio.listarPorMes('2026-02');

      expect(find).toHaveBeenCalledWith({
        fecha: { $gte: '2026-02-01', $lte: '2026-02-28' },
      });
    });
  });

  describe('obtenerPorFecha', () => {
    it('responde 404 cuando la fecha no existe', async () => {
      const modelo = crearModelo();
      modelo.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const servicio = crearServicio(modelo);

      await expect(servicio.obtenerPorFecha('2026-10-20')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('devuelve la jornada encontrada', async () => {
      const modelo = crearModelo();
      modelo.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(crearPersistida()),
      });
      const servicio = crearServicio(modelo);

      const respuesta = await servicio.obtenerPorFecha('2026-10-20');

      expect(respuesta.gastos[0].id).toBe(ID_A);
    });
  });

  describe('actualizar', () => {
    it('respeta los campos no enviados y conserva identificadores existentes', async () => {
      const modelo = crearModelo();
      const existente: JornadaPersistida & { save: jest.Mock } = {
        ...crearPersistida({
          ingresos: { efectivo: 100000, uber: 50000 },
          gastos: [
            { id: ID_A, concepto: 'Combustible', valor: 30000 },
            { id: ID_B, concepto: 'Peaje', valor: 12000 },
          ],
        }),
        save: jest.fn(),
      };
      existente.save.mockResolvedValue(existente);
      modelo.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existente),
      });
      const servicio = crearServicio(modelo);

      const respuesta = await servicio.actualizar('2026-10-20', {
        ingresos: { efectivo: 200000 },
        gastos: [
          { id: ID_A, concepto: 'Combustible actualizado', valor: 35000 },
          { concepto: 'Nuevo gasto', valor: 5000 },
        ],
      });

      expect(existente.ingresos).toEqual({ efectivo: 200000, uber: 50000 });
      expect(existente.persona).toBe('papa');
      expect(existente.observaciones).toBe('Jornada normal');
      expect(existente.gastos).toHaveLength(2);
      expect(existente.gastos[0]).toEqual({
        id: ID_A,
        concepto: 'Combustible actualizado',
        valor: 35000,
      });
      expect(existente.gastos[1].id).toMatch(UUID_V4);
      expect(existente.gastos[1].id).not.toBe(ID_A);
      expect(respuesta.ingresos.uber).toBe(50000);
    });

    it('permite cambiar entre los valores internos de ambos conductores', async () => {
      const modelo = crearModelo();
      const existente: JornadaPersistida & { save: jest.Mock } = {
        ...crearPersistida({ persona: 'papa' }),
        save: jest.fn(),
      };
      existente.save.mockResolvedValue(existente);
      modelo.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existente),
      });
      const servicio = crearServicio(modelo);

      const respuesta = await servicio.actualizar('2026-10-20', {
        persona: 'hermano',
      });

      expect(existente.persona).toBe('hermano');
      expect(existente.fecha).toBe('2026-10-20');
      expect(respuesta.persona).toBe('hermano');
    });

    it('rechaza identificadores duplicados en la lista de gastos', async () => {
      const modelo = crearModelo();
      const existente: JornadaPersistida & { save: jest.Mock } = {
        ...crearPersistida(),
        save: jest.fn(),
      };
      modelo.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existente),
      });
      const servicio = crearServicio(modelo);

      await expect(
        servicio.actualizar('2026-10-20', {
          gastos: [
            { id: ID_A, concepto: 'Combustible', valor: 30000 },
            { id: ID_A, concepto: 'Duplicado', valor: 10000 },
          ],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(existente.save).not.toHaveBeenCalled();
    });

    it('responde 404 cuando la fecha no existe', async () => {
      const modelo = crearModelo();
      modelo.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const servicio = crearServicio(modelo);

      await expect(
        servicio.actualizar('2026-10-20', { persona: 'hermano' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('eliminar', () => {
    it('responde 404 cuando la fecha no existe', async () => {
      const modelo = crearModelo();
      modelo.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });
      const servicio = crearServicio(modelo);

      await expect(servicio.eliminar('2026-10-20')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('elimina la jornada existente', async () => {
      const modelo = crearModelo();
      const exec = jest.fn().mockResolvedValue({ deletedCount: 1 });
      modelo.deleteOne.mockReturnValue({ exec });
      const servicio = crearServicio(modelo);

      await expect(servicio.eliminar('2026-10-20')).resolves.toBeUndefined();
      expect(modelo.deleteOne).toHaveBeenCalledWith({ fecha: '2026-10-20' });
    });
  });
});
