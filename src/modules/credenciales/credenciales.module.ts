import { Module } from '@nestjs/common';
import { CredencialesService } from './credenciales.service';
import { CredencialesResolver } from './credenciales.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from '../personas/entities/persona.entity';
import { PersonasModule } from '../personas/personas.module';
import { Credencial } from './entities/credencial.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CredencialesController } from './credenciales.controller';
import { MailModule } from 'src/mail/mail.module';
import { PersonasRolesModule } from 'src/mroles-permisos/personas_roles/personas_roles.module';
import { RolesModule } from 'src/mroles-permisos/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credencial, Persona]),
    PersonasModule,
    ScheduleModule.forRoot(),
    MailModule,
    PersonasRolesModule,
    RolesModule,
  ],
  providers: [CredencialesResolver, CredencialesService],
  exports: [CredencialesService],
  controllers: [CredencialesController],
})
export class CredencialesModule {}
