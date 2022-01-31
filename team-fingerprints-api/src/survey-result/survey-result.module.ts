import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyAnswerModule } from 'src/survey-answer/survey-answer.module';
import { User, UserSchema } from 'src/users/models/user.model';
import { SurveyResultController } from './survey-result.controller';
import { SurveyResultService } from './survey-result.service';

@Module({
  imports: [
    forwardRef(() => SurveyAnswerModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SurveyResultController],
  providers: [SurveyResultService],
  exports: [SurveyResultService],
})
export class SurveyResultModule {}
