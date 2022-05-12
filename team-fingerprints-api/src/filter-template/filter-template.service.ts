import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyModel } from 'src/company/models/company.model';
import * as mongoose from 'mongoose';
import { TeamModel } from 'src/company/models/team.model';
import { TemplateFilterConfigDto } from './dto/filter-templates.dto';
import { DetailQuery, FilterTemplate } from 'team-fingerprints-common';

@Injectable()
export class FilterTemplateService {
  constructor(
    @InjectModel(CompanyModel.name)
    private readonly companyModel: Model<CompanyModel>,
  ) {}

  async getFilterTemplates(
    surveyId: string,
    companyId: string,
    teamId: string | null = null,
  ) {
    if (!teamId || teamId.length <= 0) {
      const company = await this.companyModel.findById(companyId);
      const filterTemplates = company.filterTemplates.filter(Boolean);
      if (!filterTemplates || filterTemplates.length <= 0) return [];
      return filterTemplates.filter(
        (template) => template.surveyId === surveyId,
      );
    }

    const { teams } = await this.companyModel.findById(companyId, {
      teams: 1,
    });

    const team: TeamModel = teams.find(
      (team) => team._id.toString() === teamId,
    );

    return team.filterTemplates.filter(
      (template) => template.surveyId === surveyId,
    );
  }

  async createFilterTemplate(
    surveyId: string,
    filters: DetailQuery,
    templateFilterConfig: TemplateFilterConfigDto,
    companyId: string,
    teamId: string | null = null,
  ): Promise<TeamModel> {
    const filterTemplate = {
      _id: new mongoose.Types.ObjectId().toString(),
      surveyId,
      filters,
    };

    if (!teamId || teamId.length <= 0) {
      return await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        {
          $push: {
            filterTemplates: { ...filterTemplate, ...templateFilterConfig },
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
              ...filterTemplate,
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
    surveyId: string,
    filters: DetailQuery,
    templateFilterConfig: TemplateFilterConfigDto,
    filterId: string,
    companyId: string,
    teamId: string | null = null,
  ) {
    const newFilterTemplate = {
      surveyId,
      _id: filterId,
      filters,
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
    surveyId: string,
    filterId: string,
    companyId: string,
    teamId: string | null = null,
  ): Promise<FilterTemplate[] | TeamModel> {
    if (!teamId || teamId.length <= 0) {
      const { filterTemplates } = await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        { $pull: { filterTemplates: { _id: filterId, surveyId } } },
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
