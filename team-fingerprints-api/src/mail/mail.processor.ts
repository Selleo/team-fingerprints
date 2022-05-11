import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { emailtemplate } from 'src/templates/email.template';

@Processor('mailsend')
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: unknown) {
    this.logger.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${
        job.name
      }. Result: ${JSON.stringify(result)}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: Error) {
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
        html: emailtemplate(
          `Welcome ${job.data.to} in <b>Selleo Team Fingerprint`,
        ),
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
        from: this.configService.get<string>('MAIL_USER'),
        subject: `You were invited to ${job.data.companyName} company - testing new account mail`,
        html: emailtemplate(
          `Hi ${job.data.to}, you were invited to ${job.data.companyName} company`,
          'https://teamfingerprints.selleo.com/manage',
        ),
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
        from: this.configService.get<string>('MAIL_USER'),
        subject: `You were invited to ${job.data.companyName} company - testing new account mail`,
        html: emailtemplate(
          `Hi ${job.data.to}, you were invited to ${job.data.teamName} team in ${job.data.companyName} company`,
        ),
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
        from: this.configService.get<string>('MAIL_USER'),
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
