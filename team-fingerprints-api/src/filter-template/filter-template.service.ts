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

  async createTemplateFilter(
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
}
