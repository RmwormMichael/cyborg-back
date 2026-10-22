"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_setup_1 = require("./app.setup");
(0, dotenv_1.config)({ quiet: true });
const DEFAULT_PORT = 3000;
const HOST = '0.0.0.0';
async function bootstrap() {
    const port = Number(process.env.PORT ?? DEFAULT_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(`Puerto inválido: ${process.env.PORT}`);
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, app_setup_1.configurarAplicacion)(app);
    await app.listen(port, HOST);
    console.log(`API de Control del Carro disponible en http://${HOST}:${port}/api`);
}
void bootstrap();
//# sourceMappingURL=main.js.map