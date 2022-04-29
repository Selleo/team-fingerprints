import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyModel, SurveySchema } from 'src/survey/models/survey.model';
import { UserModel, UserSchema } from 'src/users/models/user.model';
import { SurveySummarizeService } from './survey-summarize.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
      {
        name: SurveyModel.name,
        schema: SurveySchema,
      },
    ]),
  ],
  providers: [SurveySummarizeService],
  exports: [SurveySummarizeService],
})
export class SurveySummarizeModule {}
