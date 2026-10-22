import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { crearOpcionesMongoose } from './database/mongoose.config';
import { JornadasModule } from './jornadas/jornadas.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => crearOpcionesMongoose(),
    }),
    JornadasModule,
    ReportesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
