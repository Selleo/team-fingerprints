import { Routes } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { TeamModule } from './company/team/team.module';
import { CategoryModule } from './survey/category/category.module';
import { QuestionModule } from './survey/category/trend/question/question.module';
import { TrendModule } from './survey/category/trend/trend.module';
import { SurveyModule } from './survey/survey.module';

export const routes: Routes = [
  {
    path: 'surveys',
    module: SurveyModule,
    children: [
      {
        path: '/:surveyId/categories',
        module: CategoryModule,
        children: [
          {
            path: '/:categoryId/trends',
            module: TrendModule,
            children: [
              {
                path: '/:trendId/questions/',
                module: QuestionModule,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'companies',
    module: CompanyModule,
    children: [
      {
        path: '/:companyId/teams',
        module: TeamModule,
      },
    ],
  },
];
