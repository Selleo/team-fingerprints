import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterService } from 'src/filter/filter.service';
import { RoleI } from 'src/role/interfaces/role.interface';
import { RoleService } from 'src/role/role.service';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { Survey } from 'src/survey/models/survey.model';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SurveyResultService {
  constructor(
    @Inject(forwardRef(() => SurveyAnswerService))
    private readonly surveyAnswerService: SurveyAnswerService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly roleService: RoleService,
    private readonly usersService: UsersService,
    private readonly filterService: FilterService,
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

  async getAvgResultForAllCompanies(surveyId: string, queries: any) {
    const usersIds = await this.getUsersIds();
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('Users was not found');

    const filteredUsersIds = await this.getUsersIdsByUserDetails(
      usersIds,
      queries,
    );
    return await this.countPoints(surveyId, filteredUsersIds);
  }

  async getAvgResultForCompany(
    surveyId: string,
    companyId: string,
    queries: any,
  ) {
    const usersIds = await this.getUsersIds({ companyId });
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('Users was not found');

    const filteredUsersIds = await this.getUsersIdsByUserDetails(
      usersIds,
      queries,
    );
    return await this.countPoints(surveyId, filteredUsersIds);
  }

  async getAvgResultForTeam(surveyId: string, teamId: string, queries: any) {
    const usersIds = await this.getUsersIds({ teamId });
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('Users was not found');

    const filteredUsersIds = await this.getUsersIdsByUserDetails(
      usersIds,
      queries,
    );
    return await this.countPoints(surveyId, filteredUsersIds);
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

  async getUsersIdsByUserDetails(usersIds: string[], queries: any) {
    if (Object.keys(queries).length <= 0) return usersIds;
    const users = (
      await Promise.all(
        usersIds.map(async (id) => {
          return await this.usersService.getUserByUserDetails(id, queries);
        }),
      )
    ).filter(Boolean);

    return users.map((user) => user._id.toString());
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

  async getAvailableFilters(usersIds: string[]) {
    const usersDetails = (
      await Promise.all(
        usersIds.map(async (userId) => {
          const user = await this.usersService.getUser(userId);
          return user.userDetails && Object.keys(user.userDetails).length > 0
            ? user.userDetails
            : null;
        }),
      )
    ).filter(Boolean);

    const filtersList = await this.filterService.getFiltersList();
    const filtersPaths = filtersList.map((filter) => filter.filterPath);

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

    const availableFilters = await Promise.all(
      Object.keys(groupedFilters).map(async (path) => {
        let values = groupedFilters[path].values.filter(
          (item: string, index: number) =>
            groupedFilters[path].values.indexOf(item) == index,
        );

        values = await Promise.all(
          values.map(async (value: string) => {
            return await this.filterService.getFilterValue(path, value);
          }),
        );

        const { _id, name, filterPath } =
          await this.filterService.getFilterByFilterPath(path);

        return {
          _id: _id.toString(),
          name,
          filterPath,
          values,
        };
      }),
    );

    return availableFilters;
  }

  async getAvailableFiltersForCompanies() {
    const usersIds = await this.getUsersIds();
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('There are not available filters');
    return await this.getAvailableFilters(usersIds);
  }

  async getAvailableFiltersForCompany(companyId: string) {
    const usersIds = await this.getUsersIds({ companyId });
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('There are not available filters');
    return await this.getAvailableFilters(usersIds);
  }

  async getAvailableFiltersForTeam(companyId: string, teamId: string) {
    const usersIds = await this.getUsersIds({ companyId, teamId });
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('There are not available filters');
    return await this.getAvailableFilters(usersIds);
  }
}
