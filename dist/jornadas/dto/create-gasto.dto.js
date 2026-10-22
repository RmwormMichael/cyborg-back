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
exports.CreateGastoDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateGastoDto {
    concepto;
    valor;
}
exports.CreateGastoDto = CreateGastoDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)({ message: 'gastos.concepto debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'gastos.concepto no puede estar vacío' }),
    (0, class_validator_1.MaxLength)(200, {
        message: 'gastos.concepto no puede superar los 200 caracteres',
    }),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "concepto", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'gastos.valor debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'gastos.valor no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateGastoDto.prototype, "valor", void 0);
//# sourceMappingURL=create-gasto.dto.js.map