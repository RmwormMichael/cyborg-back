import { IsUUID, ValidateIf } from 'class-validator';
import { CreateGastoDto } from './create-gasto.dto';

export class UpdateGastoDto extends CreateGastoDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsUUID('4', {
    message: 'gastos.id debe ser un identificador UUID válido',
  })
  id?: string;
}
