import { MongooseError } from 'mongoose';
import { crearOpcionesMongoose } from './mongoose.config';

const URI =
  'mongodb+srv://usuario:secreto@cluster-ejemplo.mongodb.net/bd_pruebas?retryWrites=true&w=majority';

describe('crearOpcionesMongoose', () => {
  it('falla con un mensaje claro cuando falta MONGODB_URI', () => {
    expect(() => crearOpcionesMongoose({} as NodeJS.ProcessEnv)).toThrow(
      /MONGODB_URI no está configurada/,
    );
  });

  it('rechaza una URI con formato inválido sin mostrarla', () => {
    expect(() =>
      crearOpcionesMongoose({
        MONGODB_URI: 'postgres://usuario:secreto@host/bd',
      } as NodeJS.ProcessEnv),
    ).toThrow(/mongodb:\/\/ o mongodb\+srv:\/\//);
  });

  it('devuelve la URI configurada y sanea los errores de conexión', () => {
    const opciones = crearOpcionesMongoose({
      MONGODB_URI: `  ${URI}  `,
      FRONTEND_ORIGIN: 'http://127.0.0.1:5173',
    } as NodeJS.ProcessEnv);

    expect(opciones.uri).toBe(URI);
    expect(opciones.retryAttempts).toBe(1);

    const error = opciones.connectionErrorFactory?.(
      new MongooseError(`Falló la conexión a ${URI}`),
    );

    expect(error).toBeInstanceOf(MongooseError);
    expect(error?.message).toContain('MongoDB Atlas');
    expect(error?.message).not.toContain('secreto');
    expect(error?.message).not.toContain(URI);
  });
});
