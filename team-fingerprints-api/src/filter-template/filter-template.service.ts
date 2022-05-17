import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyModel } from 'src/company/models/company.model';
import * as mongoose from 'mongoose';
import { TemplateFilterConfigDto } from './dto/filter-templates.dto';
import { DetailQuery } from 'team-fingerprints-common';
import { FilterTemplateModel } from 'src/company/models/filter-template.model';

@Injectable()
export class FilterTemplateService {
  constructor(
    @InjectModel(CompanyModel.name)
    private readonly companyModel: Model<CompanyModel>,
  ) {}

  async getFilterTemplatesForCompany(
    surveyId: string,
    companyId: string,
  ): Promise<FilterTemplateModel[]> {
    const company = await this.companyModel.findById(companyId);
    const filterTemplates = company.filterTemplates.filter(Boolean);
    if (!filterTemplates || filterTemplates.length <= 0) return [];
    return filterTemplates.filter((template) => template.surveyId === surveyId);
  }

  async getFilterTemplatesForTeam(
    surveyId: string,
    companyId: string,
    teamId: string | null = null,
  ): Promise<FilterTemplateModel[]> {
    const { teams } = await this.companyModel.findById(companyId, {
      teams: 1,
    });

    const team = teams.find(({ _id }) => _id.toString() === teamId);

    return team.filterTemplates.filter(
      (template) => template.surveyId === surveyId,
    );
  }

  async createFilterTemplateInCompany(
    surveyId: string,
    filters: DetailQuery,
    templateFilterConfig: TemplateFilterConfigDto,
    companyId: string,
  ): Promise<FilterTemplateModel> {
    const filterTemplate: FilterTemplateModel = {
      _id: new mongoose.Types.ObjectId().toString(),
      surveyId,
      filters,
      ...templateFilterConfig,
    };

    const company = await this.companyModel.findOneAndUpdate(
      { _id: companyId },
      {
        $push: {
          filterTemplates: { ...filterTemplate },
        },
      },
      { new: true },
    );

    if (!company)
      throw new InternalServerErrorException('Something went wrong');

    return company.filterTemplates.find(
      ({ _id }) => _id === filterTemplate._id,
    );
  }

  async createFilterTemplateInTeam(
    surveyId: string,
    filters: DetailQuery,
    templateFilterConfig: TemplateFilterConfigDto,
    companyId: string,
    teamId: string | null = null,
  ): Promise<FilterTemplateModel> {
    const filterTemplate = {
      _id: new mongoose.Types.ObjectId().toString(),
      surveyId,
      filters,
    };

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

    if (!teams) throw new InternalServerErrorException('Something went wrong');

    const { filterTemplates } = teams.find(
      (team) => team._id.toString() === teamId,
    );

    return filterTemplates.find(({ _id }) => _id === filterTemplate._id);
  }

  async updateFilterTemplateInCompany(
    surveyId: string,
    filters: DetailQuery,
    templateFilterConfig: TemplateFilterConfigDto,
    filterId: string,
    companyId: string,
  ) {
    const newFilterTemplate = {
      surveyId,
      _id: filterId,
      filters,
    };

    const company = await this.companyModel.findOneAndUpdate(
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

    if (!company)
      throw new InternalServerErrorException('Something went wrong');

    return company.filterTemplates.find(({ _id }) => _id === filterId);
  }

  async updateFilterTemplateInTeam(
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
        arrayFilters: [{ 'teamId._id': teamId }, { 'filterId._id': filterId }],
        new: true,
      },
    );

    if (!teams) throw new InternalServerErrorException('Something went wrong');

    const team = teams.find((team) => team._id.toString() === teamId);

    return team.filterTemplates.find(({ _id }) => _id === filterId);
  }

  async removeFilterTemplateFromCompany(
    surveyId: string,
    filterId: string,
    companyId: string,
  ): Promise<FilterTemplateModel> {
    const company = await this.companyModel.findOneAndUpdate(
      { _id: companyId },
      { $pull: { filterTemplates: { _id: filterId, surveyId } } },
    );

    if (!company)
      throw new InternalServerErrorException('Something went wrong');

    return company.filterTemplates.find(({ _id }) => _id === filterId);
  }

  async removeFilterTemplateFromTeam(
    surveyId: string,
    filterId: string,
    companyId: string,
    teamId: string | null = null,
  ): Promise<FilterTemplateModel> {
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
        arrayFilters: [{ 'teamId._id': teamId }, { 'filterId._id': filterId }],
      },
    );

    const team = teams.find(({ _id }) => _id.toString() === teamId);

    return team.filterTemplates.find(({ _id }) => _id === filterId);
  }
}
