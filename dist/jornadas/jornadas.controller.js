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
exports.JornadasController = void 0;
const common_1 = require("@nestjs/common");
const create_jornada_dto_1 = require("./dto/create-jornada.dto");
const fecha_param_dto_1 = require("./dto/fecha-param.dto");
const mes_query_dto_1 = require("./dto/mes-query.dto");
const update_jornada_dto_1 = require("./dto/update-jornada.dto");
const jornadas_service_1 = require("./jornadas.service");
let JornadasController = class JornadasController {
    jornadasService;
    constructor(jornadasService) {
        this.jornadasService = jornadasService;
    }
    listarPorMes({ mes }) {
        return this.jornadasService.listarPorMes(mes);
    }
    obtenerPorFecha({ fecha }) {
        return this.jornadasService.obtenerPorFecha(fecha);
    }
    crear(dto) {
        return this.jornadasService.crear(dto);
    }
    actualizar({ fecha }, dto) {
        return this.jornadasService.actualizar(fecha, dto);
    }
    eliminar({ fecha }) {
        return this.jornadasService.eliminar(fecha);
    }
};
exports.JornadasController = JornadasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mes_query_dto_1.MesQueryDto]),
    __metadata("design:returntype", Promise)
], JornadasController.prototype, "listarPorMes", null);
__decorate([
    (0, common_1.Get)(':fecha'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fecha_param_dto_1.FechaParamDto]),
    __metadata("design:returntype", Promise)
], JornadasController.prototype, "obtenerPorFecha", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_jornada_dto_1.CreateJornadaDto]),
    __metadata("design:returntype", Promise)
], JornadasController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':fecha'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fecha_param_dto_1.FechaParamDto,
        update_jornada_dto_1.UpdateJornadaDto]),
    __metadata("design:returntype", Promise)
], JornadasController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)(':fecha'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fecha_param_dto_1.FechaParamDto]),
    __metadata("design:returntype", Promise)
], JornadasController.prototype, "eliminar", null);
exports.JornadasController = JornadasController = __decorate([
    (0, common_1.Controller)('jornadas'),
    __metadata("design:paramtypes", [jornadas_service_1.JornadasService])
], JornadasController);
//# sourceMappingURL=jornadas.controller.js.map