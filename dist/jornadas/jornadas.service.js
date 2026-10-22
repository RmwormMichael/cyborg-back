"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JornadasService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fechas_1 = require("../common/fechas");
const jornada_schema_1 = require("./schemas/jornada.schema");
function esErrorDuplicado(error) {
    if (typeof error !== 'object' || error === null) {
        return false;
    }
    return error.code === 11000;
}
function generarIdGasto(idsUsados) {
    let id = (0, node_crypto_1.randomUUID)();
    while (idsUsados.has(id)) {
        id = (0, node_crypto_1.randomUUID)();
    }
    idsUsados.add(id);
    return id;
}
let JornadasService = class JornadasService {
    jornadaModel;
    constructor(jornadaModel) {
        this.jornadaModel = jornadaModel;
    }
    async crear(dto) {
        const idsUsados = new Set();
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
        }
        catch (error) {
            if (esErrorDuplicado(error)) {
                throw new common_1.ConflictException(`Ya existe una jornada registrada para la fecha ${dto.fecha}.`);
            }
            throw error;
        }
    }
    async listarPorMes(mes) {
        const { desde, hasta } = (0, fechas_1.rangoDelMes)(mes);
        const jornadas = await this.jornadaModel
            .find({ fecha: { $gte: desde, $lte: hasta } })
            .sort({ fecha: 1 })
            .exec();
        return jornadas.map((jornada) => this.aRespuesta(jornada));
    }
    async obtenerPorFecha(fecha) {
        const jornada = await this.jornadaModel.findOne({ fecha }).exec();
        if (!jornada) {
            throw new common_1.NotFoundException(`No existe una jornada registrada para la fecha ${fecha}.`);
        }
        return this.aRespuesta(jornada);
    }
    async actualizar(fecha, dto) {
        const jornada = await this.jornadaModel.findOne({ fecha }).exec();
        if (!jornada) {
            throw new common_1.NotFoundException(`No existe una jornada registrada para la fecha ${fecha}.`);
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
    async eliminar(fecha) {
        const resultado = await this.jornadaModel.deleteOne({ fecha }).exec();
        if (!resultado.deletedCount) {
            throw new common_1.NotFoundException(`No existe una jornada registrada para la fecha ${fecha}.`);
        }
    }
    reemplazarGastos(gastosNuevos, gastosActuales) {
        const actualesPorId = new Map(gastosActuales.map((gasto) => [gasto.id, gasto]));
        const idsUsados = new Set();
        return gastosNuevos.map((gasto) => {
            if (gasto.id !== undefined) {
                if (idsUsados.has(gasto.id)) {
                    throw new common_1.BadRequestException('La lista de gastos contiene identificadores duplicados.');
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
    aRespuesta(jornada) {
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
};
exports.JornadasService = JornadasService;
exports.JornadasService = JornadasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(jornada_schema_1.Jornada.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], JornadasService);
//# sourceMappingURL=jornadas.service.js.map