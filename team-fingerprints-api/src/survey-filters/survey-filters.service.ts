import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { FilterService } from 'src/filter/filter.service';
import { FilterModel } from 'src/filter/models/filter.model';
import { Role } from 'src/role/types/role.types';
import { SurveyResultService } from 'src/survey-result/survey-result.service';
import { TfConfigService } from 'src/tf-config/tf-config.service';
import { UserModel } from 'src/users/models/user.model';

@Injectable()
export class SurveyFiltersService {
  constructor(
    @InjectQueue('survey-filters') private readonly surveyFiltersQueue: Queue,
    private readonly tfConfigService: TfConfigService,
    private readonly surveyResultService: SurveyResultService,
    private readonly filterService: FilterService,
  ) {}

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
    await this.surveyFiltersQueue.add('get-global-available-filters', {
      surveyId,
    });
  }

  async getAvailableFilters(surveyId: string, usersIds: string[]) {
    const usersDetails =
      (
        await this.surveyResultService.getUsersWhoFinishedSurvey(
          surveyId,
          usersIds,
        )
      )
        ?.map(({ userDetails }: UserModel) =>
          userDetails && Object.keys(userDetails).length > 0
            ? userDetails
            : null,
        )
        .filter(Boolean) || [];

    const filters: FilterModel[] = await this.filterService.getFiltersList();

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

  async getUsersForFilters(searchParam: Partial<Role> | null = null) {
    const usersIds = await this.surveyResultService.getUsersIds(searchParam);
    if (!usersIds || usersIds.length <= 0)
      throw new NotFoundException('There are not available filters');
    return usersIds;
  }
}
