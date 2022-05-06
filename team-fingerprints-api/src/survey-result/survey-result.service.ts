import { InjectQueue } from '@nestjs/bull';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model, Types } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { SurveyModel } from 'src/survey/models/survey.model';
import { TfConfigService } from 'src/tf-config/tf-config.service';
import { UserModel } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import {
  Category,
  Role,
  SurveyCompleteStatus,
  Trend,
  UserWhoFinishedSurvey,
} from 'team-fingerprints-common';

type ResultSchema = {
  category: string;
  categoryTitle: string;
  trend: string;
  trendPrimary: string;
  trendSecondary: string;
};

@Injectable()
export class SurveyResultService {
  constructor(
    @InjectQueue('survey-results') private readonly surveyResultsQueue: Queue,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(SurveyModel.name)
    private readonly surveyModel: Model<SurveyModel>,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly tfConfigService: TfConfigService,
  ) {}

  async getAvgResultForAllCompanies(surveyId: string, queries: any) {
    const usersIds = await this.getUsersIds();
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('Users was not found');

    if (Object.keys(queries).length > 0) {
      const filteredUsersIds = await this.usersService.getUsersIdsByUserDetails(
        usersIds,
        queries,
      );
      return await this.countPoints(surveyId, filteredUsersIds);
    }

    const resultsForCompanies =
      await this.tfConfigService.getGlobalSurveysResults(surveyId);

    if (
      resultsForCompanies &&
      Object.keys(resultsForCompanies.data).length > 0
    ) {
      return resultsForCompanies.data;
    } else {
      const filteredUsersIds = await this.usersService.getUsersIdsByUserDetails(
        usersIds,
      );
      const result = await this.countPoints(surveyId, filteredUsersIds);
      return (
        await this.tfConfigService.createGlobalSurveysResults(surveyId, result)
      ).data;
    }
  }

  async getAvgResultForCompany(
    surveyId: string,
    companyId: string,
    queries: any,
  ) {
    const usersIds = await this.getUsersIds({ companyId });
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('Users was not found');

    const filteredUsersIds = await this.usersService.getUsersIdsByUserDetails(
      usersIds,
      queries,
    );
    return await this.countPoints(surveyId, filteredUsersIds);
  }

  async getAvgResultForTeam(surveyId: string, teamId: string, queries: any) {
    const usersIds = await this.getUsersIds({ teamId });
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('Users was not found');

    const filteredUsersIds = await this.usersService.getUsersIdsByUserDetails(
      usersIds,
      queries,
    );
    return await this.countPoints(surveyId, filteredUsersIds);
  }

  async getSurveyResultForUsers(surveyId: string, usersIds: string[]) {
    return (await this.getUsersWhoFinishedSurvey(surveyId, usersIds)).map(
      (user) => user.surveysAnswers.surveyResult,
    );
  }

  async countPointsJob(surveyId: string) {
    await this.surveyResultsQueue.add('count-points', { surveyId });
  }

  async countPoints(surveyId: string, usersIds: string[]) {
    const survey = await this.surveyModel.findById(surveyId);
    if (!survey)
      throw new InternalServerErrorException(
        `Survey id: ${surveyId} does not exist`,
      );

    const schema: ResultSchema[] = [];

    survey.categories.forEach((category: Category) => {
      category.trends.forEach((trend: Trend) => {
        schema.push({
          category: category._id.toString(),
          categoryTitle: category.title,
          trend: trend._id.toString(),
          trendPrimary: trend.primary,
          trendSecondary: trend.secondary,
        });
      });
    });

    const entitiesResult = await this.getSurveyResultForUsers(
      surveyId,
      usersIds,
    );

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

  async getUsersIds(
    searchParam: Partial<Role> | null = null,
  ): Promise<string[]> {
    if (!searchParam) {
      const usersObjectIds = await this.userModel.find({}, { _id: 1 });
      return usersObjectIds.map((el) => el._id.toString());
    } else {
      const roleDocuments = await this.roleService.findAllRoleDocuments({
        ...searchParam,
      });

      if (roleDocuments.length <= 0) return [];

      return roleDocuments
        .filter(
          (value, index, array) =>
            index ===
            array.findIndex(
              (roleDocument) =>
                roleDocument.email === value.email && value.userId?.length > 0,
            ),
        )
        .map((roleDocument) => roleDocument.userId)
        .filter(Boolean);
    }
  }

  async getUsersWhoFinishedSurvey(
    surveyId: string,
    usersIds: string[],
  ): Promise<UserWhoFinishedSurvey[]> {
    const ids = usersIds.map((id) => new Types.ObjectId(id));
    return await this.userModel
      .aggregate([
        {
          $match: { _id: { $in: ids } },
        },
        {
          $project: {
            surveysAnswers: 1,
            userDetails: 1,
            email: 1,
          },
        },
        {
          $unwind: '$surveysAnswers',
        },
        {
          $match: {
            $and: [
              {
                'surveysAnswers.completeStatus': SurveyCompleteStatus.FINISHED,
              },
              { 'surveysAnswers.surveyId': surveyId },
            ],
          },
        },
      ])
      .exec();
  }
}
