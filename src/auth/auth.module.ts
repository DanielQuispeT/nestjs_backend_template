import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailModule } from 'src/mail/mail.module';
import { PersonasModule } from 'src/modules/personas/personas.module';
import { CredencialesModule } from 'src/modules/credenciales/credenciales.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  imports: [
    //Configuraciones
    JwtModule.register(JWT_CONFIG),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
    //Modulos
    MailModule,
    PersonasModule,
    CredencialesModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
