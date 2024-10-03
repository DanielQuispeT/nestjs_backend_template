import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { PersonaRol } from '../personas_roles/entities/persona_rol.entity';
import { RolPermiso } from '../roles_permisos/entities/rol_permiso.entity';
import { RolesResolver } from './roles.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, PersonaRol, RolPermiso])],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],
})
export class RolesModule {}
