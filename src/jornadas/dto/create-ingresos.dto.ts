import { IsInt, Min } from 'class-validator';

export class CreateIngresosDto {
  @IsInt({ message: 'ingresos.efectivo debe ser un número entero' })
  @Min(0, { message: 'ingresos.efectivo no puede ser negativo' })
  efectivo!: number;

  @IsInt({ message: 'ingresos.uber debe ser un número entero' })
  @Min(0, { message: 'ingresos.uber no puede ser negativo' })
  uber!: number;
}
