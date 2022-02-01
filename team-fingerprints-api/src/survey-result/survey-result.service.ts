import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyService } from 'src/company/company.service';
import { TeamMembersService } from 'src/company/team/team-members.service';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { Survey } from 'src/survey/models/survey.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class SurveyResultService {
  constructor(
    private readonly surveyAnswerService: SurveyAnswerService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly teamMembersService: TeamMembersService,
    private readonly companyService: CompanyService,
  ) {}

  async getSurveyResultForUser(userId: string, surveyId: string) {
    const isFinished = await this.surveyAnswerService.checkIfSurveyIsFinished(
      userId,
      surveyId,
    );
    if (!isFinished) return;

    const userAnswersAll = await this.userModel
      .findOne({
        _id: userId,
        'surveysAnswers.surveyId': surveyId,
      })
      .exec();

    const userAnswers = userAnswersAll.surveysAnswers.find(
      (el) => el.surveyId === surveyId,
    );

    const result = userAnswers.surveyResult;
    return result;
  }

  async getSurveyResult(surveyId: string, userId: string) {
    return await this.getSurveyResultForUser(userId, surveyId);
  }

  async getAvgResultForAllCompanies(surveyId: string) {
    return await this.countPoints(surveyId, 'companies', '');
  }

  async getAvgResultForCompany(surveyId: string, companyId: string) {
    return await this.countPoints(surveyId, 'company', companyId);
  }

  async getAvgResultForTeam(surveyId: string, teamId: string) {
    return await this.countPoints(surveyId, 'team', teamId);
  }

  async countPoints(
    surveyId: string,
    type: 'team' | 'company' | 'companies',
    entityId: string,
  ) {
    const schema = [];

    const survey = await this.surveyModel.findById({ _id: surveyId });
    if (!survey) return new InternalServerErrorException();
    survey.categories.map((category: any) => {
      category.trends.forEach((trend: any) => {
        schema.push({
          category: category._id.toString(),
          categoryTitle: category.title,
          trend: trend._id.toString(),
          trendPrimary: trend.primary,
          trendSecondary: trend.secondary,
        });
      });
    });

    let entitiesResult: any;
    const entitiesResultFlat = [];

    switch (type) {
      case 'team':
        const members: any = await this.teamMembersService.getTeamMembers(
          entityId,
        );

        entitiesResult = await Promise.all(
          members.map(async (member: string) => {
            return await this.getSurveyResultForUser(member, surveyId);
          }),
        );

        entitiesResult.forEach((result) => {
          if (result) {
            result?.forEach((el) => {
              entitiesResultFlat.push(el);
            });
          }
        });

        break;

      case 'company':
        entitiesResult = [];
        const { teams } = await this.companyService.getCompanyById(entityId);

        entitiesResult = await Promise.all(
          teams.map(async (team: any) => {
            return await this.getAvgResultForTeam(
              surveyId,
              team._id.toString(),
            );
          }),
        );

        for (const res of entitiesResult) {
          entitiesResultFlat.push(res);
        }

        break;

      case 'companies':
        entitiesResult = [];
        const companies = await this.companyService.getCompaneis();
        entitiesResult = await Promise.all(
          companies.map(async (company: any) => {
            return await this.getAvgResultForCompany(
              surveyId,
              company._id.toString(),
            );
          }),
        );

        for (const res of entitiesResult) {
          entitiesResultFlat.push(res);
        }

        break;
    }

    const surveyResult = {};

    schema.forEach((obj) => {
      const avgTrends = [];

      let trendCount = 0;
      let counter = 0;

      switch (type) {
        case 'team':
          {
            entitiesResultFlat.forEach((surveyAnswer) => {
              if (obj.category === surveyAnswer.categoryId) {
                surveyAnswer.avgTrends.forEach((avgTrend) => {
                  if (obj.trend === avgTrend.trendId) {
                    trendCount += avgTrend.avgTrendAnswer;
                    counter++;
                  }
                });
              }
            });
          }
          break;
        default: {
          entitiesResultFlat.forEach((surveyAnswer) => {
            if (surveyAnswer[obj.category]) {
              surveyAnswer[obj.category].avgTrends.forEach((avgTrend) => {
                if (obj.trend === avgTrend.trendId) {
                  if (avgTrend.avgTrendAnswer) {
                    trendCount += avgTrend.avgTrendAnswer;
                    counter++;
                  }
                }
              });
            }
          });
        }
      }

      avgTrends.push({
        trendId: obj.trend,
        trendPrimary: obj.trendPrimary,
        trendSecondary: obj.trendSecondary,
        avgTrendAnswer: trendCount / counter,
      });

      if (surveyResult[obj.category]) {
        surveyResult[obj.category] = {
          categoryTitle: obj.categoryTitle,
          categoryId: obj.category,
          avgTrends: [...avgTrends, ...surveyResult[obj.category].avgTrends],
        };
      } else {
        surveyResult[obj.category] = {
          categoryTitle: obj.categoryTitle,
          categoryId: obj.category,
          avgTrends,
        };
      }
    });

    return surveyResult;
  }
}
