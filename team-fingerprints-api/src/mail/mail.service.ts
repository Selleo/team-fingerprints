import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mailsend') private mailQueue: Queue) {}

  async newAccountMail(to: string): Promise<boolean> {
    try {
      this.mailQueue.add('new-account', {
        to,
      });
      return true;
    } catch (errot) {
      return false;
    }
  }

  async setNewPasswordPasswordMail(to: string): Promise<boolean> {
    try {
      this.mailQueue.add('reset-password', {
        to,
      });
      return true;
    } catch (errot) {
      return false;
    }
  }
}
