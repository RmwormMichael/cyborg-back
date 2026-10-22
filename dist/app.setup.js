"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarAplicacion = configurarAplicacion;
const common_1 = require("@nestjs/common");
const DEFAULT_FRONTEND_ORIGIN = 'http://127.0.0.1:5173';
function configurarAplicacion(app) {
    const frontendOrigin = (process.env.FRONTEND_ORIGIN ?? DEFAULT_FRONTEND_ORIGIN).replace(/\/+$/, '');
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [frontendOrigin],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
}
//# sourceMappingURL=app.setup.js.map