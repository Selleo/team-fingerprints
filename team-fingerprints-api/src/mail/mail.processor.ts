import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('mailsend')
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${
        job.name
      }. Result: ${JSON.stringify(result)}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.stack}`,
      error.stack,
    );
  }

  @Process('new-user')
  async newUserMail(job: Job) {
    try {
      const success = await this.mailerService.sendMail({
        to: job.data.to,
        from: 'fingerprints@selleo.com',
        subject:
          'Welcome to Selleo Team Fingerprints - testing new account mail',
        html: `<p>Hi ${job.data.to} in <b>Selleo Team Fingerprint</b></p>
          <p><a href="https://teamfingerprints.selleo.com/">Team Fingerprints</a></p>
        `,
      });
      return success;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Process('invite-to-company')
  async inviteToCompanyMail(job: Job) {
    try {
      const success = await this.mailerService.sendMail({
        to: job.data.to,
        from: 'fingerprints@selleo.com',
        subject: `You were invited to ${job.data.companyName} company - testing new account mail`,
        html: `<p>Hi ${job.data.to}, you were invited to <b> ${job.data.companyName} company</b></p>
        <p><a href="https://teamfingerprints.selleo.com/manage">Team Fingerprints</a></p>
        `,
      });
      return success;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Process('invite-to-team')
  async inviteToTeamMail(job: Job) {
    try {
      const success = await this.mailerService.sendMail({
        to: job.data.to,
        from: 'fingerprints@selleo.com',
        subject: `You were invited to ${job.data.companyName} company - testing new account mail`,
        html: `<p>Hi ${job.data.to}, you were invited to <b> ${job.data.teamName} team</b> in ${job.data.companyName} company</p>
        <p><a href="https://teamfingerprints.selleo.com/manage">Team Fingerprints</a></p>`,
      });
      return success;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Process('new-team-leader')
  async newTeamLeaderMail(job: Job) {
    try {
      const success = await this.mailerService.sendMail({
        to: job.data.to,
        from: 'fingerprints@selleo.com',
        subject: `You you became a team leader in ${job.data.companyName} company - testing new account mail`,
        html: `<p>Hi ${job.data.to}, you became a team leader in <b> ${job.data.teamName} team</b> in ${job.data.companyName} company</p>
        <p><a href="https://teamfingerprints.selleo.com/manage">Team Fingerprints</a></p>`,
      });
      return success;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
