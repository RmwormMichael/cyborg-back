"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarAplicacion = configurarAplicacion;
const common_1 = require("@nestjs/common");
const DEFAULT_FRONTEND_ORIGINS = ['http://127.0.0.1:5173'];
function obtenerOrigenesPermitidos() {
    const configurados = (process.env.FRONTEND_ORIGIN ?? '')
        .split(',')
        .map((origen) => origen.trim().replace(/\/+$/, ''))
        .filter((origen) => origen.length > 0);
    return configurados.length > 0
        ? configurados
        : DEFAULT_FRONTEND_ORIGINS;
}
function configurarAplicacion(app) {
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: obtenerOrigenesPermitidos(),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
}
//# sourceMappingURL=app.setup.js.map