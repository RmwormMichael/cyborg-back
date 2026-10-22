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
exports.ResumenQueryDto = void 0;
const class_validator_1 = require("class-validator");
const personas_1 = require("../../common/personas");
const is_calendar_date_validator_1 = require("../../common/validators/is-calendar-date.validator");
class ResumenQueryDto {
    desde;
    hasta;
    persona;
}
exports.ResumenQueryDto = ResumenQueryDto;
__decorate([
    (0, is_calendar_date_validator_1.IsCalendarDate)(),
    __metadata("design:type", String)
], ResumenQueryDto.prototype, "desde", void 0);
__decorate([
    (0, is_calendar_date_validator_1.IsCalendarDate)(),
    __metadata("design:type", String)
], ResumenQueryDto.prototype, "hasta", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsIn)(personas_1.PERSONAS, {
        message: 'persona debe ser "papa" o "hermano"',
    }),
    __metadata("design:type", String)
], ResumenQueryDto.prototype, "persona", void 0);
//# sourceMappingURL=resumen-query.dto.js.map