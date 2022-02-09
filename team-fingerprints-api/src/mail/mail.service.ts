import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, html: string): Promise<any> {
    await this.mailerService.sendMail({ to, subject, html });
  }

  async sendEmail() {
    const DOMAIN = 'sandboxf44ddb0274b849c6bbffff77bd5bc4d3.mailgun.org';
    const mg = mailgun({
      apiKey: 'adb3ab4001bc4948141bd47ae5d2654f-d2cc48bc-560fb827',
      domain: DOMAIN,
    });
    const data = {
      from: 'Mailgun Sandbox <postmaster@sandboxf44ddb0274b849c6bbffff77bd5bc4d3.mailgun.org>',
      to: 'm.zupa@selleo.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!',
    };
    await mg.messages().send(data, (err, body) => {
      console.log(body);
    });
  }
}
