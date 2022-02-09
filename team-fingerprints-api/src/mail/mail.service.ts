import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail() {
    const DOMAIN = this.configService.get<string>('MAILGUN_DOMAIN');
    const mg = mailgun({
      apiKey: this.configService.get<string>('MAILGUN_API_KEY'),
      domain: DOMAIN,
    });
    const data = {
      from: `Mailgun Sandbox <postmaster@${DOMAIN}>`,
      to: 'm.zupa@selleo.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!',
    };
    await mg.messages().send(data, (err) => {
      if (err) throw new InternalServerErrorException();
    });
  }
}
