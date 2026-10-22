import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { FechaParamDto } from './dto/fecha-param.dto';
import { MesQueryDto } from './dto/mes-query.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { JornadasService } from './jornadas.service';
import { JornadaResponse } from './jornadas.types';

@Controller('jornadas')
export class JornadasController {
  constructor(private readonly jornadasService: JornadasService) {}

  @Get()
  listarPorMes(@Query() { mes }: MesQueryDto): Promise<JornadaResponse[]> {
    return this.jornadasService.listarPorMes(mes);
  }

  @Get(':fecha')
  obtenerPorFecha(
    @Param() { fecha }: FechaParamDto,
  ): Promise<JornadaResponse> {
    return this.jornadasService.obtenerPorFecha(fecha);
  }

  @Post()
  crear(@Body() dto: CreateJornadaDto): Promise<JornadaResponse> {
    return this.jornadasService.crear(dto);
  }

  @Patch(':fecha')
  actualizar(
    @Param() { fecha }: FechaParamDto,
    @Body() dto: UpdateJornadaDto,
  ): Promise<JornadaResponse> {
    return this.jornadasService.actualizar(fecha, dto);
  }

  @Delete(':fecha')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param() { fecha }: FechaParamDto): Promise<void> {
    return this.jornadasService.eliminar(fecha);
  }
}
