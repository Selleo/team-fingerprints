import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/survey/entities/survey.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { SurveySummarizeService } from './survey-summarize.service';
import { SurveySummarizeController } from './survey-summarize.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
  ],
  providers: [SurveySummarizeService],
  exports: [SurveySummarizeService],
  controllers: [SurveySummarizeController],
})
export class SurveySummarizeModule {}
