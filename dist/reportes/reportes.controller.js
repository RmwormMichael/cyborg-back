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
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const resumen_query_dto_1 = require("./dto/resumen-query.dto");
const reportes_service_1 = require("./reportes.service");
let ReportesController = class ReportesController {
    reportesService;
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    obtenerResumen(query) {
        return this.reportesService.obtenerResumen(query);
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resumen_query_dto_1.ResumenQueryDto]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "obtenerResumen", null);
exports.ReportesController = ReportesController = __decorate([
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService])
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map