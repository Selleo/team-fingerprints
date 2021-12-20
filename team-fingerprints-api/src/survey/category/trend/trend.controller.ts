import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class TrendController {
  @Get()
  printSth() {
    return 'trend path';
  }

  @Get(':trendId')
  helloWorld(@Param('trendId') trendId: string): string {
    return trendId;
  }
}
