import { Module } from '@nestjs/common';
import { ArchivosAdjuntosService } from './archivos-adjuntos.service';
import { ArchivosAdjuntosResolver } from './archivos-adjuntos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivoAdjunto } from './entities/archivo-adjunto.entity';
import { ArchivosModule } from '../archivos/archivos.module';

@Module({
  providers: [ArchivosAdjuntosResolver, ArchivosAdjuntosService],
  imports: [TypeOrmModule.forFeature([ArchivoAdjunto]), ArchivosModule],
  exports: [ArchivosAdjuntosService],
})
export class ArchivosAdjuntosModule {}
