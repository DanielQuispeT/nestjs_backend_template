import { Module } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { PermisosResolver } from './permisos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolPermiso } from '../roles_permisos/entities/rol_permiso.entity';
import { Permiso } from './entities/permiso.entity';
// import { AuditoriaRegistrosModule } from 'src/auditoria_registros/auditoria_registros.module';
import { DependenciasPermisosModule } from '../dependencias_permisos/dependencias_permisos.module';
import { PersonasRolesModule } from '../personas_roles/personas_roles.module';
import { PersonaPermisosPersonalizadoModule } from '../persona_permisos_personalizado/persona_permisos_personalizado.module';
import { RolesModule } from '../roles/roles.module';
import { RolesPermisosModule } from '../roles_permisos/roles_permisos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso, RolPermiso]),
    // AuditoriaRegistrosModule,
    DependenciasPermisosModule,
    PersonasRolesModule,
    PersonaPermisosPersonalizadoModule,
    RolesModule,
    RolesPermisosModule,
  ],
  providers: [PermisosResolver, PermisosService],
  exports: [PermisosService],
})
export class PermisosModule {}
