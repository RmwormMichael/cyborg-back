"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JornadasModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jornadas_controller_1 = require("./jornadas.controller");
const jornadas_service_1 = require("./jornadas.service");
const jornada_schema_1 = require("./schemas/jornada.schema");
let JornadasModule = class JornadasModule {
};
exports.JornadasModule = JornadasModule;
exports.JornadasModule = JornadasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: jornada_schema_1.Jornada.name, schema: jornada_schema_1.JornadaSchema },
            ]),
        ],
        controllers: [jornadas_controller_1.JornadasController],
        providers: [jornadas_service_1.JornadasService],
        exports: [mongoose_1.MongooseModule],
    })
], JornadasModule);
//# sourceMappingURL=jornadas.module.js.map