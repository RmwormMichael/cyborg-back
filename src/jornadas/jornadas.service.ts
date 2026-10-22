import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rangoDelMes } from '../common/fechas';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import {
  JornadaDocument,
  Gasto,
  Jornada,
} from './schemas/jornada.schema';
import {
  GastoResponse,
  JornadaPersistida,
  JornadaResponse,
} from './jornadas.types';

function esErrorDuplicado(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  return (error as { code?: unknown }).code === 11000;
}

function generarIdGasto(idsUsados: Set<string>): string {
  let id = randomUUID();

  while (idsUsados.has(id)) {
    id = randomUUID();
  }

  idsUsados.add(id);
  return id;
}

@Injectable()
export class JornadasService {
  constructor(
    @InjectModel(Jornada.name)
    private readonly jornadaModel: Model<JornadaDocument>,
  ) {}

  async crear(dto: CreateJornadaDto): Promise<JornadaResponse> {
    const idsUsados = new Set<string>();

    try {
      const creada = await this.jornadaModel.create({
        fecha: dto.fecha,
        persona: dto.persona,
        ingresos: {
          efectivo: dto.ingresos.efectivo,
          uber: dto.ingresos.uber,
        },
        gastos: dto.gastos.map((gasto) => ({
          id: generarIdGasto(idsUsados),
          concepto: gasto.concepto.trim(),
          valor: gasto.valor,
        })),
        ...(dto.observaciones !== undefined
          ? { observaciones: dto.observaciones.trim() }
          : {}),
      });

      return this.aRespuesta(creada);
    } catch (error) {
      if (esErrorDuplicado(error)) {
        throw new ConflictException(
          `Ya existe una jornada registrada para la fecha ${dto.fecha}.`,
        );
      }

      throw error;
    }
  }

  async listarPorMes(mes: string): Promise<JornadaResponse[]> {
    const { desde, hasta } = rangoDelMes(mes);
    const jornadas = await this.jornadaModel
      .find({ fecha: { $gte: desde, $lte: hasta } })
      .sort({ fecha: 1 })
      .exec();

    return jornadas.map((jornada) => this.aRespuesta(jornada));
  }

  async obtenerPorFecha(fecha: string): Promise<JornadaResponse> {
    const jornada = await this.jornadaModel.findOne({ fecha }).exec();

    if (!jornada) {
      throw new NotFoundException(
        `No existe una jornada registrada para la fecha ${fecha}.`,
      );
    }

    return this.aRespuesta(jornada);
  }

  async actualizar(
    fecha: string,
    dto: UpdateJornadaDto,
  ): Promise<JornadaResponse> {
    const jornada = await this.jornadaModel.findOne({ fecha }).exec();

    if (!jornada) {
      throw new NotFoundException(
        `No existe una jornada registrada para la fecha ${fecha}.`,
      );
    }

    if (dto.persona !== undefined) {
      jornada.persona = dto.persona;
    }

    if (dto.observaciones !== undefined) {
      jornada.observaciones = dto.observaciones.trim();
    }

    if (dto.ingresos !== undefined) {
      jornada.ingresos = {
        efectivo: dto.ingresos.efectivo ?? jornada.ingresos.efectivo,
        uber: dto.ingresos.uber ?? jornada.ingresos.uber,
      };
    }

    if (dto.gastos !== undefined) {
      jornada.gastos = this.reemplazarGastos(dto.gastos, jornada.gastos);
    }

    const actualizada = await jornada.save();

    return this.aRespuesta(actualizada);
  }

  async eliminar(fecha: string): Promise<void> {
    const resultado = await this.jornadaModel.deleteOne({ fecha }).exec();

    if (!resultado.deletedCount) {
      throw new NotFoundException(
        `No existe una jornada registrada para la fecha ${fecha}.`,
      );
    }
  }

  private reemplazarGastos(
    gastosNuevos: UpdateGastoDto[],
    gastosActuales: Gasto[],
  ): GastoResponse[] {
    const actualesPorId = new Map(
      gastosActuales.map((gasto) => [gasto.id, gasto]),
    );
    const idsUsados = new Set<string>();

    return gastosNuevos.map((gasto) => {
      if (gasto.id !== undefined) {
        if (idsUsados.has(gasto.id)) {
          throw new BadRequestException(
            'La lista de gastos contiene identificadores duplicados.',
          );
        }

        idsUsados.add(gasto.id);

        if (actualesPorId.has(gasto.id)) {
          return {
            id: gasto.id,
            concepto: gasto.concepto.trim(),
            valor: gasto.valor,
          };
        }
      }

      return {
        id: generarIdGasto(idsUsados),
        concepto: gasto.concepto.trim(),
        valor: gasto.valor,
      };
    });
  }

  private aRespuesta(jornada: JornadaPersistida): JornadaResponse {
    return {
      fecha: jornada.fecha,
      persona: jornada.persona,
      ingresos: {
        efectivo: jornada.ingresos.efectivo,
        uber: jornada.ingresos.uber,
      },
      gastos: jornada.gastos.map((gasto) => ({
        id: gasto.id,
        concepto: gasto.concepto,
        valor: gasto.valor,
      })),
      ...(jornada.observaciones !== undefined
        ? { observaciones: jornada.observaciones }
        : {}),
      createdAt: jornada.createdAt,
      updatedAt: jornada.updatedAt,
    };
  }
}
