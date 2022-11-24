import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly emailSenderService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmail(email: string, html: string) {
    return await this.emailSenderService.sendMail({
      to: email,
      from: this.configService.get('EMAIL_SENDER_MAIL'),
      html,
    });
  }
}
