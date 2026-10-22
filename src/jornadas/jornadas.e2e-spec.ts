import { config } from 'dotenv';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../app.module';
import { configurarAplicacion } from '../app.setup';
import { Jornada, JornadaDocument } from './schemas/jornada.schema';

config({ quiet: true });

const uriPruebas = process.env.TEST_MONGODB_URI?.trim();
const describirIntegracion = uriPruebas ? describe : describe.skip;
const FECHAS_PRUEBA = ['2099-01-10', '2099-01-11', '2099-02-01'];
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describirIntegracion(
  'Jornadas y reportes contra MongoDB (integración)',
  () => {
    let app: INestApplication;
    let modelo: Model<JornadaDocument>;

    beforeAll(async () => {
      process.env.MONGODB_URI = uriPruebas;
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = moduleRef.createNestApplication();
      configurarAplicacion(app);
      await app.init();
      modelo = moduleRef.get<Model<JornadaDocument>>(
        getModelToken(Jornada.name),
      );
      await modelo.deleteMany({ fecha: { $in: FECHAS_PRUEBA } }).exec();
    });

    afterAll(async () => {
      if (modelo) {
        await modelo.deleteMany({ fecha: { $in: FECHAS_PRUEBA } }).exec();
      }
      if (app) {
        await app.close();
      }
    });

    it('crea, consulta, edita parcialmente y elimina una jornada', async () => {
      const servidor = app.getHttpServer();

      const creada = await request(servidor)
        .post('/api/jornadas')
        .send({
          fecha: FECHAS_PRUEBA[0],
          persona: 'papa',
          ingresos: { efectivo: 120000, uber: 80000 },
          gastos: [{ concepto: 'Combustible', valor: 30000 }],
          observaciones: 'Jornada de prueba',
        })
        .expect(201);

      expect(creada.body.fecha).toBe(FECHAS_PRUEBA[0]);
      expect(creada.body.gastos).toHaveLength(1);
      const idGasto = creada.body.gastos[0].id as string;
      expect(idGasto).toMatch(UUID_V4);

      await request(servidor)
        .post('/api/jornadas')
        .send({
          fecha: FECHAS_PRUEBA[0],
          persona: 'hermano',
          ingresos: { efectivo: 0, uber: 0 },
          gastos: [],
        })
        .expect(409);

      await request(servidor)
        .get(`/api/jornadas/${FECHAS_PRUEBA[0]}`)
        .expect(200);

      const editada = await request(servidor)
        .patch(`/api/jornadas/${FECHAS_PRUEBA[0]}`)
        .send({
          ingresos: { efectivo: 150000 },
          observaciones: 'Editada',
        })
        .expect(200);

      expect(editada.body.ingresos).toEqual({ efectivo: 150000, uber: 80000 });
      expect(editada.body.gastos[0].id).toBe(idGasto);
      expect(editada.body.persona).toBe('papa');

      await request(servidor)
        .patch(`/api/jornadas/${FECHAS_PRUEBA[0]}`)
        .send({ fecha: '2099-01-15' })
        .expect(400);

      await request(servidor)
        .delete(`/api/jornadas/${FECHAS_PRUEBA[0]}`)
        .expect(204);

      await request(servidor)
        .get(`/api/jornadas/${FECHAS_PRUEBA[0]}`)
        .expect(404);

      await request(servidor)
        .delete(`/api/jornadas/${FECHAS_PRUEBA[0]}`)
        .expect(404);
    });

    it('lista por mes y calcula el resumen con filtros', async () => {
      const servidor = app.getHttpServer();

      await request(servidor)
        .post('/api/jornadas')
        .send({
          fecha: FECHAS_PRUEBA[1],
          persona: 'papa',
          ingresos: { efectivo: 100000, uber: 50000 },
          gastos: [{ concepto: 'Peaje', valor: 10000 }],
        })
        .expect(201);

      await request(servidor)
        .post('/api/jornadas')
        .send({
          fecha: FECHAS_PRUEBA[2],
          persona: 'hermano',
          ingresos: { efectivo: 60000, uber: 20000 },
          gastos: [],
        })
        .expect(201);

      const listado = await request(servidor)
        .get('/api/jornadas?mes=2099-01')
        .expect(200);

      expect(listado.body).toHaveLength(1);
      expect(listado.body[0].fecha).toBe(FECHAS_PRUEBA[1]);

      const resumen = await request(servidor)
        .get('/api/reportes/resumen?desde=2099-01-01&hasta=2099-02-28')
        .expect(200);

      expect(resumen.body.ingresosEfectivo).toBe(160000);
      expect(resumen.body.ingresosUber).toBe(70000);
      expect(resumen.body.ingresosTotales).toBe(230000);
      expect(resumen.body.gastosTotales).toBe(10000);
      expect(resumen.body.gananciaNeta).toBe(220000);
      expect(resumen.body.jornadas).toBe(2);

      const resumenPapa = await request(servidor)
        .get('/api/reportes/resumen?desde=2099-01-01&hasta=2099-02-28&persona=papa')
        .expect(200);

      expect(resumenPapa.body.jornadas).toBe(1);
      expect(resumenPapa.body.porPersona).toHaveLength(1);
      expect(resumenPapa.body.porPersona[0].persona).toBe('papa');

      await request(servidor)
        .get('/api/reportes/resumen?desde=2099-02-28&hasta=2099-01-01')
        .expect(400);
    });
  },
);
