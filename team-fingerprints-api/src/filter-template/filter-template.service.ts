import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import * as mongoose from 'mongoose';

@Injectable()
export class FilterTemplateService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  async createTemplateFilter(
    templateFilterData: any,
    companyId: string,
    teamId: string | null = null,
  ) {
    if (!teamId || teamId.length <= 0) {
      return await this.companyModel.findOneAndUpdate(
        {
          _id: companyId,
        },
        {
          $push: {
            filterTemplates: {
              _id: new mongoose.Types.ObjectId().toString(),
              ...templateFilterData,
            },
          },
        },
        {
          new: true,
        },
      );
    }

    const { teams } = await this.companyModel.findOneAndUpdate(
      {
        _id: companyId,
        'teams.$': teamId,
      },
      {
        $push: {
          'teams.$.filterTemplates': {
            _id: new mongoose.Types.ObjectId().toString(),
            ...templateFilterData,
          },
        },
      },
      {
        new: true,
      },
    );

    return teams.filter((team) => team._id.toString() === teamId);
  }
}
