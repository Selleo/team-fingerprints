import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveySummarizeModule } from 'src/survey-summarize/survey-summarize.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { SurveyResponseController } from './survey-response.controller';
import { SurveyResponseService } from './survey-response.service';

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
  controllers: [SurveyResponseController],
  providers: [SurveyResponseService],
})
export class SurveyRresponseModule {}
