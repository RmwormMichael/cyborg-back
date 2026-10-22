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
exports.UpdateJornadaDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const personas_1 = require("../../common/personas");
const update_gasto_dto_1 = require("./update-gasto.dto");
const update_ingresos_dto_1 = require("./update-ingresos.dto");
class UpdateJornadaDto {
    persona;
    ingresos;
    gastos;
    observaciones;
}
exports.UpdateJornadaDto = UpdateJornadaDto;
__decorate([
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsIn)(personas_1.PERSONAS, {
        message: 'persona debe ser "papa" o "hermano"',
    }),
    __metadata("design:type", String)
], UpdateJornadaDto.prototype, "persona", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsObject)({ message: 'ingresos debe ser un objeto' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => update_ingresos_dto_1.UpdateIngresosDto),
    __metadata("design:type", update_ingresos_dto_1.UpdateIngresosDto)
], UpdateJornadaDto.prototype, "ingresos", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsArray)({ message: 'gastos debe ser un arreglo' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => update_gasto_dto_1.UpdateGastoDto),
    __metadata("design:type", Array)
], UpdateJornadaDto.prototype, "gastos", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)({ message: 'observaciones debe ser un texto' }),
    (0, class_validator_1.MaxLength)(1000, {
        message: 'observaciones no puede superar los 1000 caracteres',
    }),
    __metadata("design:type", String)
], UpdateJornadaDto.prototype, "observaciones", void 0);
//# sourceMappingURL=update-jornada.dto.js.map