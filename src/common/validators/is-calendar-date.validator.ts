import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { esFechaCalendario } from '../fechas';

export function IsCalendarDate(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'isCalendarDate',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return esFechaCalendario(value);
        },
        defaultMessage(): string {
          return 'La fecha debe ser válida y tener el formato YYYY-MM-DD';
        },
      },
    });
  };
}
