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
exports.CreateIngresosDto = void 0;
const class_validator_1 = require("class-validator");
class CreateIngresosDto {
    efectivo;
    uber;
}
exports.CreateIngresosDto = CreateIngresosDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'ingresos.efectivo debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'ingresos.efectivo no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateIngresosDto.prototype, "efectivo", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'ingresos.uber debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'ingresos.uber no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateIngresosDto.prototype, "uber", void 0);
//# sourceMappingURL=create-ingresos.dto.js.map