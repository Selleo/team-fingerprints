import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './survey/category/category.module';
import { QuestionModule } from './survey/category/trend/question/question.module';
import { TrendModule } from './survey/category/trend/trend.module';
import { SurveyModule } from './survey/survey.module';
import { UsersModule } from './users/users.module';
import { SurveyAnswerModule } from './survey-answer/survey-answer.module';
import { CompanyModule } from './company/company.module';
import { TeamModule } from './company/team/team.module';
import { ConfigModule } from '@nestjs/config';
import { routes } from './routes';
import { SurveySummarizeModule } from './survey-summarize/survey-summarize.module';
import { AuthModule } from './auth/auth.module';
import { SurveyResultModule } from './survey-result/survey-result.module';
import { FilterModule } from './filter/filter.module';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './mail/mail.module';
import { TfConfigModule } from './tf-config/tf-config.module';
import { FilterTemplateModule } from './filter-template/filter-template.module';
import {
  configModuleConfig,
  mongooseModuleConfig,
  bullModuleConfig,
} from './config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleConfig),
    MongooseModule.forRootAsync(mongooseModuleConfig),
    BullModule.forRootAsync(bullModuleConfig),
    RouterModule.register(routes),
    SurveyModule,
    CategoryModule,
    TrendModule,
    QuestionModule,
    UsersModule,
    SurveyAnswerModule,
    CompanyModule,
    TeamModule,
    SurveySummarizeModule,
    AuthModule,
    SurveyResultModule,
    FilterModule,
    MailModule,
    TfConfigModule,
    FilterTemplateModule,
  ],
})
export class AppModule {}
