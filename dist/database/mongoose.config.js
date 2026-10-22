"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearOpcionesMongoose = crearOpcionesMongoose;
const mongoose_1 = require("mongoose");
const ERROR_CONEXION = 'No se pudo conectar a MongoDB Atlas. Revisa MONGODB_URI, las credenciales y las IP permitidas.';
const ERROR_URI_FALTANTE = 'MONGODB_URI no está configurada. Crea backend/.env a partir de backend/.env.example.';
const ERROR_URI_INVALIDA = 'MONGODB_URI no tiene un formato válido. Debe comenzar con mongodb:// o mongodb+srv://.';
function crearOpcionesMongoose(env = process.env) {
    const uri = env.MONGODB_URI?.trim();
    if (!uri) {
        throw new Error(ERROR_URI_FALTANTE);
    }
    if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
        throw new Error(ERROR_URI_INVALIDA);
    }
    return {
        uri,
        serverSelectionTimeoutMS: 8000,
        retryAttempts: 1,
        retryDelay: 1000,
        connectionErrorFactory: () => new mongoose_1.MongooseError(ERROR_CONEXION),
    };
}
//# sourceMappingURL=mongoose.config.js.map