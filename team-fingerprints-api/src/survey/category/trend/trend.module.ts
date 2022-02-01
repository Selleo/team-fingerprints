import { Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
    QuestionModule,
  ],
  controllers: [TrendController],
  providers: [TrendService],
  exports: [TrendService],
})
export class TrendModule {}
