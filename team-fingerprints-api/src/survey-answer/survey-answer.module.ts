import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveySummarizeModule } from 'src/survey-summarize/survey-summarize.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { SurveyAnswerController } from './survey-answer.controller';
import { SurveyAnswerService } from './survey-answer.service';

@Module({
  imports: [
    SurveySummarizeModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SurveyAnswerController],
  providers: [SurveyAnswerService],
})
export class SurveyAnswerModule {}
