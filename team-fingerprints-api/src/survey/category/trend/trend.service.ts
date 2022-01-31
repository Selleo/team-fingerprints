import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import {
  CreateTrendDto,
  TrendParamsDto,
  UpdateTrendDto,
} from './dto/trend.dto';

@Injectable()
export class TrendService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async createTrend(
    { surveyId, categoryId }: TrendParamsDto,
    { primary, secondary }: CreateTrendDto,
  ): Promise<Survey> {
    return await this.surveyModel.findOneAndUpdate(
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $push: {
          'categories.$.trends': {
            primary,
            secondary,
          },
        },
      },
      { new: true },
    );
  }

  async updateTrend(
    { surveyId, categoryId, trendId }: TrendParamsDto,
    { primary, secondary }: UpdateTrendDto,
  ): Promise<Survey> {
    return await this.surveyModel.findOneAndUpdate(
      {
        _id: surveyId,
      },
      {
        $set: {
          'categories.$[category].trends.$[trend].primary': primary,
          'categories.$[category].trends.$[trend].secondary': secondary,
        },
      },
      {
        arrayFilters: [
          {
            'trend._id': trendId,
          },
          { 'category._id': categoryId },
        ],
        new: true,
      },
    );
  }

  async removeTrend(trendId: string): Promise<Survey> {
    return await this.surveyModel.findOneAndUpdate(
      {
        'categories.trends._id': trendId,
      },
      {
        $pull: {
          'categories.$[].trends': { _id: trendId },
        },
      },
      { new: true },
    );
  }
}
