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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const personas_1 = require("../common/personas");
const jornada_schema_1 = require("../jornadas/schemas/jornada.schema");
function crearAcumulado() {
    return {
        ingresosEfectivo: 0,
        ingresosUber: 0,
        gastosTotales: 0,
        jornadas: 0,
    };
}
function aResumenPersona(persona, acumulado) {
    const ingresosTotales = acumulado.ingresosEfectivo + acumulado.ingresosUber;
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
let ReportesService = class ReportesService {
    jornadaModel;
    constructor(jornadaModel) {
        this.jornadaModel = jornadaModel;
    }
    async obtenerResumen(query) {
        const { desde, hasta, persona } = query;
        if (desde > hasta) {
            throw new common_1.BadRequestException('La fecha "desde" no puede ser posterior a la fecha "hasta".');
        }
        const filtro = {
            fecha: { $gte: desde, $lte: hasta },
            ...(persona !== undefined ? { persona } : {}),
        };
        const jornadas = (await this.jornadaModel
            .find(filtro)
            .lean()
            .exec());
        return this.calcularResumen(jornadas, desde, hasta, persona);
    }
    calcularResumen(jornadas, desde, hasta, persona) {
        const personas = persona ? [persona] : [...personas_1.PERSONAS];
        const acumulados = new Map(personas.map((actual) => [actual, crearAcumulado()]));
        for (const jornada of jornadas) {
            const acumulado = acumulados.get(jornada.persona);
            if (!acumulado) {
                continue;
            }
            acumulado.ingresosEfectivo += jornada.ingresos.efectivo;
            acumulado.ingresosUber += jornada.ingresos.uber;
            acumulado.gastosTotales += jornada.gastos.reduce((total, gasto) => total + gasto.valor, 0);
            acumulado.jornadas += 1;
        }
        const porPersona = personas.map((actual) => aResumenPersona(actual, acumulados.get(actual) ?? crearAcumulado()));
        const totales = porPersona.reduce((total, parcial) => ({
            ingresosEfectivo: total.ingresosEfectivo + parcial.ingresosEfectivo,
            ingresosUber: total.ingresosUber + parcial.ingresosUber,
            ingresosTotales: total.ingresosTotales + parcial.ingresosTotales,
            gastosTotales: total.gastosTotales + parcial.gastosTotales,
            gananciaNeta: total.gananciaNeta + parcial.gananciaNeta,
            jornadas: total.jornadas + parcial.jornadas,
        }), {
            ingresosEfectivo: 0,
            ingresosUber: 0,
            ingresosTotales: 0,
            gastosTotales: 0,
            gananciaNeta: 0,
            jornadas: 0,
        });
        return {
            desde,
            hasta,
            ...totales,
            porPersona,
        };
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(jornada_schema_1.Jornada.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map