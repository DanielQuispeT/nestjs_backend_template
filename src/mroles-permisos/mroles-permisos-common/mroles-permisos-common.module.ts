import { Module } from '@nestjs/common';
import { MrolesPermisosCommonService } from './mroles-permisos-common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependenciaPermiso } from '../dependencias_permisos/entities/dependencias_permiso.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import { PersonaRol } from '../personas_roles/entities/persona_rol.entity';
import { PersonaPermisoPersonalizado } from '../persona_permisos_personalizado/entities/persona_permisos_personalizado.entity';
import { Rol } from '../roles/entities/rol.entity';
import { RolPermiso } from '../roles_permisos/entities/rol_permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DependenciaPermiso,
      Permiso,
      PersonaRol,
      PersonaPermisoPersonalizado,
      Rol,
      RolPermiso,
    ]),
  ],
  providers: [MrolesPermisosCommonService],
  exports: [MrolesPermisosCommonService],
})
export class MrolesPermisosCommonModule {}
