import { Module } from '@nestjs/common';
import { DependenciasPermisosService } from './dependencias_permisos.service';
import { DependenciasPermisosResolver } from './dependencias_permisos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependenciaPermiso } from './entities/dependencias_permiso.entity';

@Module({
  providers: [DependenciasPermisosResolver, DependenciasPermisosService],
  imports: [TypeOrmModule.forFeature([DependenciaPermiso])],
  exports: [DependenciasPermisosService],
})
export class DependenciasPermisosModule {}
