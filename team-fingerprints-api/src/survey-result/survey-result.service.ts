import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleI } from 'src/role/interfaces/role.interface';
import { RoleService } from 'src/role/role.service';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { Survey } from 'src/survey/models/survey.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class SurveyResultService {
  constructor(
    @Inject(forwardRef(() => SurveyAnswerService))
    private readonly surveyAnswerService: SurveyAnswerService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly roleService: RoleService,
  ) {}

  async getSurveyResultForUser(surveyId: string, userId: string) {
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

  async getAvgResultForAllCompanies(surveyId: string) {
    const usersIds = await this.getUsersIds();
    return await this.countPoints(surveyId, usersIds);
  }

  async getAvgResultForCompany(surveyId: string, companyId: string) {
    const usersIds = await this.getUsersIds({ companyId });
    return await this.countPoints(surveyId, usersIds);
  }

  async getAvgResultForTeam(surveyId: string, teamId: string) {
    const usersIds = await this.getUsersIds({ teamId });
    return await this.countPoints(surveyId, usersIds);
  }

  async getUsersIds(
    searchParam: Partial<RoleI> | null = null,
  ): Promise<string[]> {
    if (!searchParam) {
      const usersObjectIds = await this.userModel.find({}, { _id: 1 });
      return usersObjectIds.map((el) => el._id.toString());
    } else {
      const roleDocuments = await this.roleService.findAllRoleDocuments({
        ...searchParam,
      });

      if (roleDocuments.length <= 0) throw new NotFoundException();

      return roleDocuments
        .filter(
          (value, index, array) =>
            index ===
            array.findIndex(
              (el) => el.email === value.email && value.userId?.length > 0,
            ),
        )
        .map((rolDoc) => rolDoc.userId)
        .filter(Boolean);
    }
  }

  async countPoints(surveyId: string, usersIds: string[]) {
    const survey = await this.surveyModel.findById({ _id: surveyId });
    if (!survey) throw new InternalServerErrorException();

    const schema = [];

    survey.categories.forEach((category: any) => {
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

    const entitiesResult = (
      await Promise.all(
        usersIds.map(async (userId: string) => {
          return await this.getSurveyResultForUser(surveyId, userId);
        }),
      )
    ).filter(Boolean);

    const entitiesResultFlat = [];
    entitiesResult.forEach((result) => {
      if (result) {
        result?.forEach((el) => {
          entitiesResultFlat.push(el);
        });
      }
    });

    const surveyResult = {};

    schema.forEach((obj) => {
      const avgTrends = [];

      let trendCount = 0;
      let counter = 0;

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
          avgTrends: [...surveyResult[obj.category].avgTrends, ...avgTrends],
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
