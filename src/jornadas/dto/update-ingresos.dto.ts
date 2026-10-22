import { IsInt, Min, ValidateIf } from 'class-validator';

export class UpdateIngresosDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsInt({ message: 'ingresos.efectivo debe ser un número entero' })
  @Min(0, { message: 'ingresos.efectivo no puede ser negativo' })
  efectivo?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt({ message: 'ingresos.uber debe ser un número entero' })
  @Min(0, { message: 'ingresos.uber no puede ser negativo' })
  uber?: number;
}
