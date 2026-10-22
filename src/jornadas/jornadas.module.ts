import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JornadasController } from './jornadas.controller';
import { JornadasService } from './jornadas.service';
import { Jornada, JornadaSchema } from './schemas/jornada.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Jornada.name, schema: JornadaSchema },
    ]),
  ],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [MongooseModule],
})
export class JornadasModule {}
