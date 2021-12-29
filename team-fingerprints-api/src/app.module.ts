import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './survey/category/category.module';
import { QuestionModule } from './survey/category/trend/question/question.module';
import { TrendModule } from './survey/category/trend/trend.module';
import { SurveyModule } from './survey/survey.module';
import { UsersModule } from './users/users.module';
import { SurveyRresponseModule } from './survey-response/survey-response.module';
import { CompanyModule } from './company/company.module';
import { TeamModule } from './company/team/team.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { routes } from './routes';
import * as Joi from 'joi';

const envValidaion = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  AUTH_ENABLED: Joi.boolean().default(false),
  MONGODB_URI: Joi.string().default('mongodb://localhost:27017/surveys'),
});

const mongooseModuleConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
};

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV ? `${ENV}.env` : `development.env`,
      validationSchema: envValidaion,
      validationOptions: {
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync(mongooseModuleConfig),
    RouterModule.register(routes),
    SurveyModule,
    CategoryModule,
    TrendModule,
    QuestionModule,
    UsersModule,
    SurveyRresponseModule,
    CompanyModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
