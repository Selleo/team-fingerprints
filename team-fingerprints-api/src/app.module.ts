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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { routes } from './routes';
import { SurveySummarizeModule } from './survey-summarize/survey-summarize.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { SurveyResultModule } from './survey-result/survey-result.module';
import { FilterModule } from './filter/filter.module';
import { BullModule } from '@nestjs/bull';

const envValidaion = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  AUTH_ENABLED: Joi.boolean().default(false),
  MONGODB_URI: Joi.string().default('mongodb://localhost:27017/surveys'),
  API_KEY: Joi.string(),
});

const ENV = process.env.NODE_ENV;

const configModuleConfig = {
  envFilePath: ENV ? `.env.${ENV}` : `.env.development`,
  validationSchema: envValidaion,
  validationOptions: {
    abortEarly: true,
  },
};

const mongooseModuleConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
};

console.log({ data: process.env.REDIS_HOST });

const bullModuleConfig = {
  redis: {
    port: 6379,
    host: 'localhost',
    password: 'redis',
  },
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleConfig),
    MongooseModule.forRootAsync(mongooseModuleConfig),
    BullModule.forRoot(bullModuleConfig),
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
  ],
})
export class AppModule {}
