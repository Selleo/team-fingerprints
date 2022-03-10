import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';
import { SurveyAnswerModule } from 'src/survey-answer/survey-answer.module';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';
import { User, UserSchema } from 'src/users/models/user.model';
import { SurveyResultController } from './survey-result.controller';
import { SurveyResultService } from './survey-result.service';

@Module({
  imports: [
    forwardRef(() => SurveyAnswerModule),
    forwardRef(() => RoleModule),
    TeamModule,
    CompanyModule,
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
  controllers: [SurveyResultController],
  providers: [SurveyResultService],
  exports: [SurveyResultService],
})
export class SurveyResultModule {}
