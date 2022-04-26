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
import { FilterService } from 'src/filter/filter.service';
import { Filter } from 'src/filter/models/filter.model';
import { RoleI } from 'src/role/interfaces/role.interface';
import { RoleService } from 'src/role/role.service';
import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';
import { Survey } from 'src/survey/models/survey.model';
import { TfConfigService } from 'src/tf-config/tf-config.service';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SurveyResultService {
  constructor(
    @InjectQueue('survey-results') private readonly surveyResultsQueue: Queue,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly filterService: FilterService,
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

  async getAvailableFiltersForCompanies(surveyId: string) {
    const availableFilters =
      await this.tfConfigService.getGlobalAvailableFilters(surveyId);

    if (availableFilters?.data && availableFilters.data.length > 0) {
      return availableFilters.data;
    } else {
      const usersIds = await this.getUsersForFilters();
      const newAvailableFilters = await this.getAvailableFilters(
        surveyId,
        usersIds,
      );

      return (
        await this.tfConfigService.createGlobalAvailableFilters(
          surveyId,
          newAvailableFilters,
        )
      ).data;
    }
  }

  async updateGlobalAvailableFiltersWhenUserChangeUserDetails(
    surveysIds: string[],
  ) {
    const usersIds = await this.getUsersForFilters();

    surveysIds.forEach(async (surveyId) => {
      const newAvailableFilters = await this.getAvailableFilters(
        surveyId,
        usersIds,
      );

      await this.tfConfigService.updateGlobalAvailableFilters(
        surveyId,
        newAvailableFilters,
      );
    });
  }

  async getAvailableFiltersForCompany(surveyId: string, companyId: string) {
    const usersIds = await this.getUsersForFilters({ companyId });
    return await this.getAvailableFilters(surveyId, usersIds);
  }

  async getAvailableFiltersForTeam(
    surveyId: string,
    companyId: string,
    teamId: string,
  ) {
    const usersIds = await this.getUsersForFilters({ companyId, teamId });
    return await this.getAvailableFilters(surveyId, usersIds);
  }

  async getAvailableFiltersForCompaniesJob(surveyId: string) {
    await this.surveyResultsQueue.add('get-global-available-filters', {
      surveyId,
    });
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
    searchParam: Partial<RoleI> | null = null,
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

  async getAvailableFilters(surveyId: string, usersIds: string[]) {
    const usersDetails =
      (await this.getUsersWhoFinishedSurvey(surveyId, usersIds))
        ?.map(({ userDetails }: User) =>
          userDetails && Object.keys(userDetails).length > 0
            ? userDetails
            : null,
        )
        .filter(Boolean) || [];

    const filters: Filter[] = await this.filterService.getFiltersList();

    const filtersPaths = filters.map((filter) => filter.filterPath);

    const groupedFilters = [];

    usersDetails.forEach((detail) => {
      filtersPaths.forEach((path) => {
        if (Object.keys(detail).includes(path)) {
          if (groupedFilters[path]) {
            groupedFilters[path] = {
              values: [...groupedFilters[path].values, detail[path]],
            };
          } else {
            groupedFilters[path] = {
              values: [detail[path]],
            };
          }
        }
      });
    });

    const availableFilters = Object.keys(groupedFilters).map((path) => {
      let values = groupedFilters[path].values.filter(
        (item: string, index: number) =>
          groupedFilters[path].values.indexOf(item) == index,
      );

      values = values.map((value: string) =>
        filters
          .find((filter) => filter.filterPath === path)
          .values.find((el) => el._id.toString() === value),
      );

      const { _id, name, filterPath } = filters.find(
        (filter) => filter.filterPath === path,
      );

      return {
        _id: _id.toString(),
        name,
        filterPath,
        values,
      };
    });

    return availableFilters;
  }

  async getUsersWhoFinishedSurvey(surveyId: string, usersIds: string[]) {
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

  async getUsersForFilters(searchParam: Partial<RoleI> | null = null) {
    const usersIds = await this.getUsersIds(searchParam);
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('There are not available filters');
    return usersIds;
  }
}
