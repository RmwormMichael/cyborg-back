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
import { UpdateGastoDto } from './update-gasto.dto';
import { UpdateIngresosDto } from './update-ingresos.dto';

export class UpdateJornadaDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsIn(PERSONAS, {
    message: 'persona debe ser "papa" o "hermano"',
  })
  persona?: Persona;

  @ValidateIf((_object, value) => value !== undefined)
  @IsObject({ message: 'ingresos debe ser un objeto' })
  @ValidateNested()
  @Type(() => UpdateIngresosDto)
  ingresos?: UpdateIngresosDto;

  @ValidateIf((_object, value) => value !== undefined)
  @IsArray({ message: 'gastos debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => UpdateGastoDto)
  gastos?: UpdateGastoDto[];

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
