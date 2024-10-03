import { Module } from '@nestjs/common';
import { AuditoriaRegistrosService } from './auditoria_registros.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaRegistro } from './entities/auditoria_registro.entity';

@Module({
  providers: [AuditoriaRegistrosService],
  imports: [TypeOrmModule.forFeature([AuditoriaRegistro])],
  exports: [AuditoriaRegistrosService],
})
export class AuditoriaRegistrosModule {}
