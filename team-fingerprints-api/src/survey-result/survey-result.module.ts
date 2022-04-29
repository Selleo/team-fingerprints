import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { FilterModule } from 'src/filter/filter.module';
import { RoleModule } from 'src/role/role.module';
import { SurveyModel, SurveySchema } from 'src/survey/models/survey.model';
import { TfConfigModule } from 'src/tf-config/tf-config.module';
import { UserModel, UserSchema } from 'src/users/models/user.model';
import { UsersModule } from 'src/users/users.module';
import { SurveyResultController } from './survey-result.controller';
import { SurveyResultProcessor } from './survey-result.processor';
import { SurveyResultService } from './survey-result.service';

@Module({
  imports: [
    TeamModule,
    FilterModule,
    forwardRef(() => CompanyModule),
    forwardRef(() => RoleModule),
    forwardRef(() => TfConfigModule),
    forwardRef(() => UsersModule),
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
    BullModule.registerQueueAsync({
      name: 'survey-results',
    }),
  ],
  controllers: [SurveyResultController],
  providers: [SurveyResultService, SurveyResultProcessor],
  exports: [SurveyResultService],
})
export class SurveyResultModule {}
