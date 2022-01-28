import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyResultModule } from 'src/survey-result/survey-result.module';
import { SurveySummarizeModule } from 'src/survey-summarize/survey-summarize.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { SurveyAnswerController } from './survey-answer.controller';
import { SurveyAnswerService } from './survey-answer.service';

@Module({
  imports: [
    SurveySummarizeModule,
    forwardRef(() => SurveyResultModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SurveyAnswerController],
  providers: [SurveyAnswerService],
  exports: [SurveyAnswerService],
})
export class SurveyAnswerModule {}
