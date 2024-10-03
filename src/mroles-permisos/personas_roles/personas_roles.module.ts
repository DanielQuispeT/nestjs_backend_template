import { Module } from '@nestjs/common';
import { PersonasRolesService } from './personas_roles.service';
import { PersonasRolesResolver } from './personas_roles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaRol } from './entities/persona_rol.entity';
import { Rol } from '../roles/entities/rol.entity';
import { MailModule } from 'src/mail/mail.module';
import { RolesPermisosModule } from '../roles_permisos/roles_permisos.module';
import { RolesModule } from '../roles/roles.module';
import { PaisesModule } from 'src/modules/paises/paises.module';
import { Persona } from 'src/modules/personas/entities/persona.entity';
import { MrolesPermisosCommonModule } from '../mroles-permisos-common/mroles-permisos-common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonaRol, Rol, Persona]),
    // AuditoriaRegistrosModule,
    MrolesPermisosCommonModule,
    RolesPermisosModule,
    PaisesModule,
    MailModule,
    RolesModule,
  ],
  providers: [PersonasRolesResolver, PersonasRolesService],
  exports: [PersonasRolesService],
  controllers: [],
})
export class PersonasRolesModule {}
