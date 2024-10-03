import { Module } from '@nestjs/common';
import { MrolesPermisosService } from './mroles-permisos.service';
import { MrolesPermisosCommonModule } from './mroles-permisos-common/mroles-permisos-common.module';
import { DependenciasPermisosModule } from './dependencias_permisos/dependencias_permisos.module';
import { PermisosModule } from './permisos/permisos.module';
import { PersonaPermisosPersonalizadoModule } from './persona_permisos_personalizado/persona_permisos_personalizado.module';
import { PersonasRolesModule } from './personas_roles/personas_roles.module';
import { RolesModule } from './roles/roles.module';
import { RolesPermisosModule } from './roles_permisos/roles_permisos.module';

@Module({
  imports: [
    MrolesPermisosCommonModule,
    // Roles y permisos
    DependenciasPermisosModule,
    PermisosModule,
    PersonaPermisosPersonalizadoModule,
    PersonasRolesModule,
    RolesModule,
    RolesPermisosModule,
  ],
  providers: [MrolesPermisosService],
  exports: [
    MrolesPermisosService,
    MrolesPermisosCommonModule,
    // Roles y permisos
    DependenciasPermisosModule,
    PermisosModule,
    PersonaPermisosPersonalizadoModule,
    PersonasRolesModule,
    RolesModule,
    RolesPermisosModule,
  ],
})
export class MrolesPermisosModule {}
