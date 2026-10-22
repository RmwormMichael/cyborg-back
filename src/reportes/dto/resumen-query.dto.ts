import { IsIn, ValidateIf } from 'class-validator';
import { PERSONAS, Persona } from '../../common/personas';
import { IsCalendarDate } from '../../common/validators/is-calendar-date.validator';

export class ResumenQueryDto {
  @IsCalendarDate()
  desde!: string;

  @IsCalendarDate()
  hasta!: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsIn(PERSONAS, {
    message: 'persona debe ser "papa" o "hermano"',
  })
  persona?: Persona;
}
