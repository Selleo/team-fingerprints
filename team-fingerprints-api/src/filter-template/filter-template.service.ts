import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyModel } from 'src/company/models/company.model';
import * as mongoose from 'mongoose';
import { TeamModel } from 'src/company/models/team.model';
import { TemplateFilterConfigDto } from './dto/filter-templates.dto';
import { FilterTemplate } from 'team-fingerprints-common';

@Injectable()
export class FilterTemplateService {
  constructor(
    @InjectModel(CompanyModel.name)
    private readonly companyModel: Model<CompanyModel>,
  ) {}

  async getFilterTemplates(companyId: string, teamId: string | null = null) {
    if (!teamId || teamId.length <= 0) {
      const { filterTemplates } = await this.companyModel.findById(companyId);
      return filterTemplates;
    }
    const { teams } = await this.companyModel.findById(companyId, {
      teams: 1,
    });

    const team: TeamModel = teams.find(
      (team) => team._id.toString() === teamId,
    );
    return team.filterTemplates;
  }

  async createFilterTemplate(
    templateFilterData: { [key: string]: string },
    templateFilterConfig: TemplateFilterConfigDto,
    companyId: string,
    teamId: string | null = null,
  ): Promise<TeamModel> {
    const filterTemplates = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...templateFilterData,
    };

    if (!teamId || teamId.length <= 0) {
      return await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        {
          $push: {
            filterTemplates: { ...filterTemplates, ...templateFilterConfig },
          },
        },
        { new: true },
      );
    } else {
      const { teams } = await this.companyModel.findOneAndUpdate(
        {
          _id: companyId,
          'teams._id': teamId,
        },
        {
          $push: {
            'teams.$.filterTemplates': {
              ...filterTemplates,
              ...templateFilterConfig,
            },
          },
        },
        { new: true },
      );

      return teams.filter((team) => team._id.toString() === teamId)[0];
    }
  }

  async updateFilterTemplate(
    templateFilterData: { [key: string]: string },
    templateFilterConfig: TemplateFilterConfigDto,
    filterId: string,
    companyId: string,
    teamId: string | null = null,
  ) {
    const newFilterTemplate = {
      _id: new mongoose.Types.ObjectId(filterId).toString(),
      ...templateFilterData,
    };

    if (!teamId || teamId.length <= 0) {
      const { filterTemplates } = await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        {
          $set: {
            'filterTemplates.$[filterId]': {
              ...newFilterTemplate,
              ...templateFilterConfig,
            },
          },
        },
        { arrayFilters: [{ 'filterId._id': filterId }], new: true },
      );
      return filterTemplates;
    } else {
      const { teams } = await this.companyModel.findOneAndUpdate(
        {
          _id: companyId,
          'teams.$.filterTemplates._id': filterId,
        },
        {
          $set: {
            'teams.$[teamId].filterTemplates.$[filterId]': {
              ...newFilterTemplate,
              ...templateFilterConfig,
            },
          },
        },
        {
          arrayFilters: [
            { 'teamId._id': teamId },
            { 'filterId._id': filterId },
          ],
          new: true,
        },
      );

      return teams.filter((team) => team._id.toString() === teamId)[0];
    }
  }

  async removeFilterTemplate(
    filterId: string,
    companyId: string,
    teamId: string | null = null,
  ): Promise<FilterTemplate[] | TeamModel> {
    if (!teamId || teamId.length <= 0) {
      const { filterTemplates } = await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        { $unset: { filterTemplates: { _id: filterId } } },
        { new: true },
      );
      return filterTemplates;
    } else {
      const { teams } = await this.companyModel.findOneAndUpdate(
        {
          _id: companyId,
          'teams.$.filterTemplates._id': filterId,
        },
        {
          $pull: {
            'teams.$[teamId].filterTemplates': { _id: filterId },
          },
        },
        {
          arrayFilters: [
            { 'teamId._id': teamId },
            { 'filterId._id': filterId },
          ],
          new: true,
        },
      );

      return teams.filter((team) => team._id.toString() === teamId)[0];
    }
  }
}
