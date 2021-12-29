import { Routes } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { TeamModule } from './company/team/team.module';
import { CategoryModule } from './survey/category/category.module';
import { QuestionModule } from './survey/category/trend/question/question.module';
import { TrendModule } from './survey/category/trend/trend.module';
import { SurveyModule } from './survey/survey.module';

export const routes: Routes = [
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
  {
    path: 'company',
    module: CompanyModule,
    children: [
      {
        path: '/:companyId/team',
        module: TeamModule,
      },
    ],
  },
];
