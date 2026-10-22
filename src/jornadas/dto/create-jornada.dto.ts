import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsObject,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PERSONAS, Persona } from '../../common/personas';
import { IsCalendarDate } from '../../common/validators/is-calendar-date.validator';
import { CreateGastoDto } from './create-gasto.dto';
import { CreateIngresosDto } from './create-ingresos.dto';

export class CreateJornadaDto {
  @IsCalendarDate()
  fecha!: string;

  @IsIn(PERSONAS, {
    message: 'persona debe ser "papa" o "hermano"',
  })
  persona!: Persona;

  @IsObject({ message: 'ingresos debe ser un objeto' })
  @ValidateNested()
  @Type(() => CreateIngresosDto)
  ingresos!: CreateIngresosDto;

  @IsArray({ message: 'gastos debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CreateGastoDto)
  gastos!: CreateGastoDto[];

  @ValidateIf((_object, value) => value !== undefined)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'observaciones debe ser un texto' })
  @MaxLength(1000, {
    message: 'observaciones no puede superar los 1000 caracteres',
  })
  observaciones?: string;
}
