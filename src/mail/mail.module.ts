import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from './mail.service';
import { isProd } from 'src/common/constants';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: isProd ? 465 : 587,
          secure: isProd,
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('APP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Break Barriers" <${configService.get<string>('EMAIL')}>`,
        },
        template: {
          dir: 'templates',
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  exports: [MailerModule, MailService],
  providers: [MailService, MailerModule],
})
export class MailModule {}
