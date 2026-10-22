import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGastoDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'gastos.concepto debe ser un texto' })
  @IsNotEmpty({ message: 'gastos.concepto no puede estar vacío' })
  @MaxLength(200, {
    message: 'gastos.concepto no puede superar los 200 caracteres',
  })
  concepto!: string;

  @IsInt({ message: 'gastos.valor debe ser un número entero' })
  @Min(0, { message: 'gastos.valor no puede ser negativo' })
  valor!: number;
}
