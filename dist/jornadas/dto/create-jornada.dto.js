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
exports.CreateJornadaDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const personas_1 = require("../../common/personas");
const is_calendar_date_validator_1 = require("../../common/validators/is-calendar-date.validator");
const create_gasto_dto_1 = require("./create-gasto.dto");
const create_ingresos_dto_1 = require("./create-ingresos.dto");
class CreateJornadaDto {
    fecha;
    persona;
    ingresos;
    gastos;
    observaciones;
}
exports.CreateJornadaDto = CreateJornadaDto;
__decorate([
    (0, is_calendar_date_validator_1.IsCalendarDate)(),
    __metadata("design:type", String)
], CreateJornadaDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsIn)(personas_1.PERSONAS, {
        message: 'persona debe ser "papa" o "hermano"',
    }),
    __metadata("design:type", String)
], CreateJornadaDto.prototype, "persona", void 0);
__decorate([
    (0, class_validator_1.IsObject)({ message: 'ingresos debe ser un objeto' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_ingresos_dto_1.CreateIngresosDto),
    __metadata("design:type", create_ingresos_dto_1.CreateIngresosDto)
], CreateJornadaDto.prototype, "ingresos", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'gastos debe ser un arreglo' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_gasto_dto_1.CreateGastoDto),
    __metadata("design:type", Array)
], CreateJornadaDto.prototype, "gastos", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)({ message: 'observaciones debe ser un texto' }),
    (0, class_validator_1.MaxLength)(1000, {
        message: 'observaciones no puede superar los 1000 caracteres',
    }),
    __metadata("design:type", String)
], CreateJornadaDto.prototype, "observaciones", void 0);
//# sourceMappingURL=create-jornada.dto.js.map