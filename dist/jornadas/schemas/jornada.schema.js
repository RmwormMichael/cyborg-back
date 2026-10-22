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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JornadaSchema = exports.Jornada = exports.Gasto = exports.Ingresos = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const personas_1 = require("../../common/personas");
function esEnteroNoNegativo(value) {
    return Number.isInteger(value) && value >= 0;
}
let Ingresos = class Ingresos {
    efectivo;
    uber;
};
exports.Ingresos = Ingresos;
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        validate: {
            validator: esEnteroNoNegativo,
            message: 'efectivo debe ser un entero no negativo',
        },
    }),
    __metadata("design:type", Number)
], Ingresos.prototype, "efectivo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        validate: {
            validator: esEnteroNoNegativo,
            message: 'uber debe ser un entero no negativo',
        },
    }),
    __metadata("design:type", Number)
], Ingresos.prototype, "uber", void 0);
exports.Ingresos = Ingresos = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Ingresos);
const IngresosSchema = mongoose_1.SchemaFactory.createForClass(Ingresos);
let Gasto = class Gasto {
    id;
    concepto;
    valor;
};
exports.Gasto = Gasto;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Gasto.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], Gasto.prototype, "concepto", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        validate: {
            validator: esEnteroNoNegativo,
            message: 'valor debe ser un entero no negativo',
        },
    }),
    __metadata("design:type", Number)
], Gasto.prototype, "valor", void 0);
exports.Gasto = Gasto = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Gasto);
const GastoSchema = mongoose_1.SchemaFactory.createForClass(Gasto);
let Jornada = class Jornada {
    fecha;
    persona;
    ingresos;
    gastos;
    observaciones;
};
exports.Jornada = Jornada;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Jornada.prototype, "fecha", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: personas_1.PERSONAS }),
    __metadata("design:type", String)
], Jornada.prototype, "persona", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: IngresosSchema, required: true }),
    __metadata("design:type", Ingresos)
], Jornada.prototype, "ingresos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [GastoSchema], default: [] }),
    __metadata("design:type", Array)
], Jornada.prototype, "gastos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true }),
    __metadata("design:type", String)
], Jornada.prototype, "observaciones", void 0);
exports.Jornada = Jornada = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Jornada);
exports.JornadaSchema = mongoose_1.SchemaFactory.createForClass(Jornada);
exports.JornadaSchema.index({ fecha: 1 }, { unique: true });
//# sourceMappingURL=jornada.schema.js.map