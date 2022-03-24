import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mailsend') private mailQueue: Queue) {}

  async newAccountMail(to: string): Promise<boolean> {
    try {
      this.mailQueue.add('new-user', {
        to,
      });
      return true;
    } catch (errot) {
      return false;
    }
  }

  async inviteToCompanyMail(to: string, companyName: string): Promise<boolean> {
    try {
      this.mailQueue.add('invite-to-company', {
        to,
        companyName,
      });
      return true;
    } catch (errot) {
      return false;
    }
  }

  async inviteToTeamMail(
    to: string,
    companyName: string,
    teamName: string,
  ): Promise<boolean> {
    try {
      this.mailQueue.add('invite-to-team', {
        to,
        companyName,
        teamName,
      });
      return true;
    } catch (errot) {
      return false;
    }
  }

  async newTeamLeaderMail(
    to: string,
    companyName: string,
    teamName: string,
  ): Promise<boolean> {
    try {
      this.mailQueue.add('new-team-leader', {
        to,
        companyName,
        teamName,
      });
      return true;
    } catch (errot) {
      return false;
    }
  }
}
