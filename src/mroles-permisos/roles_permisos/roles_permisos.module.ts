import { Module } from '@nestjs/common';
import { RolesPermisosService } from './roles_permisos.service';
import { RolesPermisosResolver } from './roles_permisos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from '../permisos/entities/permiso.entity';
import { Rol } from '../roles/entities/rol.entity';
import { RolPermiso } from './entities/rol_permiso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolPermiso, Rol, Permiso])],
  providers: [RolesPermisosResolver, RolesPermisosService],
  exports: [RolesPermisosService],
})
export class RolesPermisosModule {}
