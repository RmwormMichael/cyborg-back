import { IsCalendarDate } from '../../common/validators/is-calendar-date.validator';

export class FechaParamDto {
  @IsCalendarDate()
  fecha!: string;
}
