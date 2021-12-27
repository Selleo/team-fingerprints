import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('root-route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  hello(): string {
    return this.appService.hello();
  }
}
