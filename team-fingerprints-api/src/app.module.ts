import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './survey/category/category.module';
import { QuestionModule } from './survey/category/trend/question/question.module';
import { TrendModule } from './survey/category/trend/trend.module';
import { SurveyModule } from './survey/survey.module';

const routes: Routes = [
  {
    path: 'survey',
    module: SurveyModule,
    children: [
      {
        path: '/:surveyId/category',
        module: CategoryModule,
        children: [
          {
            path: '/:categoryId/trend',
            module: TrendModule,
            children: [
              {
                path: '/:trendId/question/',
                module: QuestionModule,
              },
            ],
          },
        ],
      },
    ],
  },
];

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/surveys'),
    SurveyModule,
    CategoryModule,
    TrendModule,
    QuestionModule,
    RouterModule.register(routes),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
