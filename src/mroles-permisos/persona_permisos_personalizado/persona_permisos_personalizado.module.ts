import { Module } from '@nestjs/common';
import { PersonaPermisosPersonalizadoService } from './persona_permisos_personalizado.service';
import { PersonaPermisosPersonalizadoResolver } from './persona_permisos_personalizado.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaPermisoPersonalizado } from './entities/persona_permisos_personalizado.entity';
import { PersonasRolesModule } from '../personas_roles/personas_roles.module';

@Module({
  providers: [
    PersonaPermisosPersonalizadoResolver,
    PersonaPermisosPersonalizadoService,
  ],
  imports: [
    TypeOrmModule.forFeature([PersonaPermisoPersonalizado]),
    PersonasRolesModule,
  ],
  exports: [PersonaPermisosPersonalizadoService],
})
export class PersonaPermisosPersonalizadoModule {}
