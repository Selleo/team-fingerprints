import { Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { MailService } from './mail.service';

@Controller({ path: 'mail', version: '1' })
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @Public()
  async sendMail() {
    return await this.mailService.sendEmail();
  }
}
