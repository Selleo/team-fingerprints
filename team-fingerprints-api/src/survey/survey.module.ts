import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { SurveyAnswerModule } from 'src/survey-answer/survey-answer.module';
import { SurveyModel, SurveySchema } from './models/survey.model';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';

@Module({
  imports: [
    SurveyAnswerModule,
    forwardRef(() => RoleModule),
    MongooseModule.forFeature([
      {
        name: SurveyModel.name,
        schema: SurveySchema,
      },
    ]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
