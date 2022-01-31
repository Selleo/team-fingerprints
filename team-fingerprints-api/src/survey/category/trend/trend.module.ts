import { Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
  ],
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
