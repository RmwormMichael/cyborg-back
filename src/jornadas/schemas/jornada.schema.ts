import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PERSONAS, Persona } from '../../common/personas';

function esEnteroNoNegativo(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

@Schema({ _id: false })
export class Ingresos {
  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: esEnteroNoNegativo,
      message: 'efectivo debe ser un entero no negativo',
    },
  })
  efectivo!: number;

  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: esEnteroNoNegativo,
      message: 'uber debe ser un entero no negativo',
    },
  })
  uber!: number;
}

const IngresosSchema = SchemaFactory.createForClass(Ingresos);

@Schema({ _id: false })
export class Gasto {
  @Prop({ type: String, required: true })
  id!: string;

  @Prop({ type: String, required: true, trim: true })
  concepto!: string;

  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: esEnteroNoNegativo,
      message: 'valor debe ser un entero no negativo',
    },
  })
  valor!: number;
}

const GastoSchema = SchemaFactory.createForClass(Gasto);

@Schema({ timestamps: true, versionKey: false })
export class Jornada {
  @Prop({ type: String, required: true })
  fecha!: string;

  @Prop({ type: String, required: true, enum: PERSONAS })
  persona!: Persona;

  @Prop({ type: IngresosSchema, required: true })
  ingresos!: Ingresos;

  @Prop({ type: [GastoSchema], default: [] })
  gastos!: Gasto[];

  @Prop({ type: String, trim: true })
  observaciones?: string;

  declare createdAt: Date;

  declare updatedAt: Date;
}

export type JornadaDocument = HydratedDocument<Jornada>;

export const JornadaSchema = SchemaFactory.createForClass(Jornada);

JornadaSchema.index({ fecha: 1 }, { unique: true });
