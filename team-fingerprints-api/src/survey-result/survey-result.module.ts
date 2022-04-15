import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { FilterModule } from 'src/filter/filter.module';
import { RoleModule } from 'src/role/role.module';
import { SurveyAnswerModule } from 'src/survey-answer/survey-answer.module';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';
import { TfConfigModule } from 'src/tf-config/tf-config.module';
import { User, UserSchema } from 'src/users/models/user.model';
import { UsersModule } from 'src/users/users.module';
import { SurveyResultController } from './survey-result.controller';
import { SurveyResultProcessor } from './survey-result.processor';
import { SurveyResultService } from './survey-result.service';

@Module({
  imports: [
    TeamModule,
    CompanyModule,
    UsersModule,
    FilterModule,
    forwardRef(() => SurveyAnswerModule),
    forwardRef(() => RoleModule),
    forwardRef(() => TfConfigModule),
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
    BullModule.registerQueueAsync({
      name: 'count-points',
    }),
  ],
  controllers: [SurveyResultController],
  providers: [SurveyResultService, SurveyResultProcessor],
  exports: [SurveyResultService],
})
export class SurveyResultModule {}
