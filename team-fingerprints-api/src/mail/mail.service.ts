import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { templ } from 'src/templates/sample/tampl';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailgun = require('mailgun-js');
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail() {
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: 'm.zupa@selleo.com',
      subject: 'Hello',
      html: templ(),
    };

    const mg = mailgun({
      apiKey: this.configService.get<string>('MAILGUN_API_KAY'),
      domain: this.configService.get<string>('MAILGUN_DOMAIN'),
    });
    mg.messages().send(data);

    return true;
  }
}
