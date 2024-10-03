import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { join } from 'path';

@Injectable()
export class OAuth2Service {
  private oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground', // o tu URL de redirección si aplica
  );

  constructor() {
    // Configura el cliente OAuth2 con el refresh token
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_API_REFRESH_TOKEN,
    });
  }

  // Obtén un nuevo token de acceso usando el refresh token
  async getAccessToken(): Promise<string> {
    try {
      const { token } = await this.oauth2Client.getAccessToken();
      Logger.log('Token de acceso obtenido: ', token);
      return token || '';
    } catch (error) {
      throw error;
    }
  }
}

export async function getMailConfig(
  oauth2Service: OAuth2Service,
): Promise<MailerOptions> {
  const accessToken = await oauth2Service.getAccessToken(); // Obtener el token dinámicamente
  return {
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_API_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_API_REFRESH_TOKEN,
        accessToken, // Usa el token obtenido dinámicamente
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@example.com>',
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
/*
    MailerModule.forRootAsync({
      useFactory: async () => {
        const oauth2Service = new OAuth2Service(); // Instancia directamente aquí
        return await getMailConfig(oauth2Service);
      },
    }),
*/

export const MAIL_CONFIG: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_API_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      timeout: 3599,
      refreshToken: process.env.GMAIL_API_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_API_ACCESS_TOKEN,
    },
  },
  defaults: {
    from: '"No Reply" <no-reply@example.com>', //process.env.GMAIL_API_USER,
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
