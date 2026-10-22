import { Matches } from 'class-validator';

export class MesQueryDto {
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'mes debe tener el formato YYYY-MM',
  })
  mes!: string;
}
