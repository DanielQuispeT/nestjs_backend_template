import { Module } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';
import { ArchivosController } from './archivos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Archivo])],
  providers: [ArchivosService],
  controllers: [ArchivosController],
  exports: [ArchivosService],
})
export class ArchivosModule {}
