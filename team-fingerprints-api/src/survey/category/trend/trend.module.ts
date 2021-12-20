import { Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';
import { QuestionModule } from './question/question.module';

@Module({
  controllers: [TrendController],
  providers: [TrendService],
  imports: [QuestionModule],
})
export class TrendModule {}
