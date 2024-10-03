import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';
import { AccessControlGuard } from './mroles-permisos/utils/access-control/access-control.guard';
import { CONFIG } from './config/config.config';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GRAPHQL_CONFIG } from './config/graphql.config';
import { MailModule } from './mail/mail.module';
import { MrolesPermisosModule } from './mroles-permisos/mroles-permisos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { PaisesModule } from './modules/paises/paises.module';
import { PersonasModule } from './modules/personas/personas.module';
import { CredencialesModule } from './modules/credenciales/credenciales.module';
import { ArchivosModule } from './modules/archivos/archivos.module';
import { ArchivosAdjuntosModule } from './modules/archivos-adjuntos/archivos-adjuntos.module';

@Module({
  imports: [
    ConfigModule.forRoot(CONFIG),
    GraphQLModule.forRoot<ApolloDriverConfig>(GRAPHQL_CONFIG),
    TypeOrmModule.forRoot(databaseConfig()),
    // Autenticación
    AuthModule,
    MrolesPermisosModule,
    // Servicios externos
    MailModule,
    // Modules
    ArchivosModule,
    ArchivosAdjuntosModule,
    CredencialesModule,
    PaisesModule,
    PersonasModule,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AccessControlGuard },
  ],
  controllers: [AppController],
})
export class AppModule {}
