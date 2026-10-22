import { HydratedDocument } from 'mongoose';
import { Persona } from '../../common/personas';
export declare class Ingresos {
    efectivo: number;
    uber: number;
}
export declare class Gasto {
    id: string;
    concepto: string;
    valor: number;
}
export declare class Jornada {
    fecha: string;
    persona: Persona;
    ingresos: Ingresos;
    gastos: Gasto[];
    observaciones?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type JornadaDocument = HydratedDocument<Jornada>;
export declare const JornadaSchema: import("mongoose").Schema<Jornada, import("mongoose").Model<Jornada, any, any, any, any, any, Jornada & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Jornada, import("mongoose").Document<unknown, {}, Jornada, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    fecha?: import("mongoose").SchemaDefinitionProperty<string, Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    persona?: import("mongoose").SchemaDefinitionProperty<"papa" | "hermano", Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ingresos?: import("mongoose").SchemaDefinitionProperty<Ingresos, Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gastos?: import("mongoose").SchemaDefinitionProperty<Gasto[], Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    observaciones?: import("mongoose").SchemaDefinitionProperty<string | undefined, Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, Jornada, import("mongoose").Document<unknown, {}, Jornada, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Jornada & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Jornada>;
