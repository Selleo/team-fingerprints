import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import * as mongoose from 'mongoose';
import { Team } from 'src/company/models/team.model';

@Injectable()
export class FilterTemplateService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  async getFilterTemplates(companyId: string, teamId: string | null = null) {
    if (!teamId || teamId.length <= 0) {
      const { filterTemplates } = await this.companyModel.findById(companyId);
      return filterTemplates;
    }
    const { teams } = await this.companyModel.findById(companyId, {
      teams: 1,
    });

    const team: Team = teams.find((team) => team._id.toString() === teamId);
    return team.filterTemplates;
  }

  async createFilterTemplate(
    templateFilterData: any,
    companyId: string,
    teamId: string | null = null,
  ) {
    const filterTemplates = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...templateFilterData,
    };

    if (!teamId || teamId.length <= 0) {
      return await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        { $push: { filterTemplates } },
        { new: true },
      );
    } else {
      const { teams } = await this.companyModel.findOneAndUpdate(
        {
          _id: companyId,
          'teams.$': teamId,
        },
        {
          $push: {
            'teams.$.filterTemplates': filterTemplates,
          },
        },
        { new: true },
      );

      return teams.filter((team) => team._id.toString() === teamId);
    }
  }

  async updateFilterTemplate(
    templateFilterData: any,
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
        { _id: companyId, 'filterTemplates._id': filterId },
        { $set: { 'filterTemplates.$': newFilterTemplate } },
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
          $set: {
            'teams.$[teamId].filterTemplates.$[filterId]': newFilterTemplate,
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

      return teams.filter((team) => team._id.toString() === teamId);
    }
  }

  async removeFilterTemplate(
    filterId: string,
    companyId: string,
    teamId: string | null = null,
  ) {
    if (!teamId || teamId.length <= 0) {
      const company = await this.companyModel.findOneAndUpdate(
        { _id: companyId, filterTemplates: { _id: filterId } },
        { $pull: { 'filterTemplates._id': filterId } },
        { new: true },
      );
      return company?.filterTemplates;
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

      return teams.filter((team) => team._id.toString() === teamId);
    }
  }
}
