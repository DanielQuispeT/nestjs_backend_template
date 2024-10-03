import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Persona } from 'src/modules/personas/entities/persona.entity';
import { Rol } from 'src/mroles-permisos/roles/entities/rol.entity';

@Injectable()
export class MailService {
  private logoUrl = `${process.env.HOST_SERVER}/archivos/public/icon_1_tsaura_blue.png`;

  constructor(private mailerService: MailerService) {}

  async sendPrueba() {
    await this.mailerService.sendMail({
      to: 'ad431942@gmail.com',
      subject: 'Prueba',
      template: './prueba',
    });
  }

  async sendUserConfirmationRoleAssigned(persona: Persona, rol: Rol) {
    this.mailerService.sendMail({
      to: persona.email,
      subject: 'Se le asignó un rol.',
      template: './assignedRole',
      context: {
        name: persona.nombres + ' ' + persona.apellidos,
        rol: rol.nombre,
        logo: `${process.env.HOST_SERVER}/archivos/logo_e-mail.png`,
      },
    });
  }
  async sendUserConfirmationRoleRemoved(persona: Persona, rol: Rol) {
    this.mailerService.sendMail({
      to: persona.email,
      subject: 'Se le desvinculó un rol.',
      template: './removedRole',
      context: {
        name: persona.nombres + ' ' + persona.apellidos,
        rol: rol.nombre,
        logo: `${process.env.HOST_SERVER}/archivos/logo_e-mail.png`,
      },
    });
  }
  async sendUserVerificationCode(persona: Persona) {
    this.mailerService.sendMail({
      to: persona.email,
      subject: 'Codigo de confirmacion',
      template: './verification',
      context: {
        logoUrl: this.logoUrl,
        name: persona.nombres,
        lastName: persona.apellidos,
        codeVerification: persona.codigo_verificacion,
      },
    });
  }

  async sendLinkRecoveryAccount(persona: Persona, link: string) {
    const name: string = persona.nombres + ' ' + persona.apellidos;
    this.mailerService.sendMail({
      to: persona.email,
      subject: 'Recuperar Cuenta',
      template: './recoveryAccount',
      context: { name, link, logoUrl: this.logoUrl },
    });
  }
}
