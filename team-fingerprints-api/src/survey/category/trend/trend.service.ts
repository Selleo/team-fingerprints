import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { CreateTrendDto } from './dto/CreateTrendDto.dto';
import { TrendParamsDto } from './dto/TrendParamsDto.dto';
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';

@Injectable()
export class TrendService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async createTrend(
    { surveyId, categoryId }: TrendParamsDto,
    { data }: CreateTrendDto,
  ) {
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $push: {
          'categories.$.trends': {
            primary: data.primary,
            secondary: data.secondary,
          },
        },
      },
    );
  }

  async updateTrend(
    { surveyId, categoryId, trendId }: TrendParamsDto,
    { data }: UpdateTrendDto,
  ) {
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
      },
      {
        $set: {
          'categories.$[category].trends.$[trend]': data,
        },
      },
      {
        arrayFilters: [
          {
            'trend._id': trendId,
          },
          { 'category._id': categoryId },
        ],
      },
    );
  }

  async removeTrend({ surveyId, categoryId, trendId }: TrendParamsDto) {
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
        'categories._id': categoryId,
        'categories.trends._id': trendId,
      },
      {
        $pull: {
          trends: { _id: trendId },
        },
      },
    );
  }
}
