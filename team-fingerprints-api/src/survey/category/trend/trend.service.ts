import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { SurveyService } from 'src/survey/survey.service';
import { CreateTrendDto } from './dto/CreateTrendDto.dto';
import { TrendParamsDto } from './dto/TrendParamsDto.dto';
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';

@Injectable()
export class TrendService {
  constructor(
    private readonly surveyService: SurveyService,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async getTrendsAll({ surveyId }: TrendParamsDto) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();

    return await this.surveyModel.find({
      _id: surveyId,
    });
  }

  // async getTrend({ surveyId, categoryId }: TrendParamsDto) {
  //   const surveyExists = await this.surveyService.getSurvey(surveyId);
  //   if (!surveyExists) return new NotFoundException();
  //   return await this.surveyModel.find(
  //     {
  //       _id: surveyId,
  //       'categories._id': categoryId,
  //     },
  //     {
  //       trends: {
  //         questions: 1,
  //         primary: 1,
  //         secondary: 1,
  //       },
  //     },
  //   );
  // }

  async createTrend(
    { surveyId, categoryId }: TrendParamsDto,
    { data }: CreateTrendDto,
  ) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();

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
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    return await this.surveyModel.updateOne(
      // {
      //   _id: surveyId,
      //   // 'categories._id': categoryId,
      // },
      // {
      //   $set: {
      //     'categories.$.trends': {
      //       primary: data.primary,
      //       secondary: data.secondary,
      //     },
      //   },
      // },
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $set: {
          'categories.$.trends.': {
            primary: data.primary,
            secondary: data.secondary,
          },
        },
      },
    );
  }

  async removeTrend({ surveyId, categoryId, trendId }: TrendParamsDto) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
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
