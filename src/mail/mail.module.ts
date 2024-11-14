import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { getMailConfig, OAuth2Service } from './oauth2.service';

@Module({
  imports: [
    /*MailerModule.forRootAsync({
      useFactory: () => ({
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
      }),
    }),*/
    MailerModule.forRootAsync({
      useFactory: async () => {
        const oauth2Service = new OAuth2Service(); // Instancia directamente aquí
        return await getMailConfig(oauth2Service);
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
