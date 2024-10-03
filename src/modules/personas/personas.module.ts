import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonasResolver } from './personas.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { MailModule } from 'src/mail/mail.module';
import { RolesModule } from 'src/mroles-permisos/roles/roles.module';
import { PersonasRolesModule } from 'src/mroles-permisos/personas_roles/personas_roles.module';
import { ArchivosAdjuntosModule } from '../archivos-adjuntos/archivos-adjuntos.module';

@Module({
  providers: [PersonasResolver, PersonasService],
  imports: [
    TypeOrmModule.forFeature([Persona]),
    MailModule,
    RolesModule,
    PersonasRolesModule,
    ArchivosAdjuntosModule,
  ],
  exports: [PersonasService],
})
export class PersonasModule {}
