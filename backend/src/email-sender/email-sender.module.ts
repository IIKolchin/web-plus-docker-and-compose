import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_SENDER_HOST'),
          port: configService.get('EMAIL_SENDER_PORT'),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get('EMAIL_SENDER_USER'),
            pass: configService.get('EMAIL_SENDER_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailSenderService, ConfigService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
