import { Injectable } from '@nestjs/common';
import { Survey } from 'src/entities/survey.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSurveyDto } from './dto/CreateSurveyDto.dto';
import { UpdateSurveyDto } from './dto/UpdateSurveyDto.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async getSurveysAll() {
    return await this.surveyModel
      .find({}, { _id: 1, public: 1, title: 1 })
      .exec();
  }

  async getSurvey(surveyId: string) {
    return await this.surveyModel.findById({ _id: surveyId }).exec();
  }

  async createSurvey({ data }: CreateSurveyDto) {
    return await this.surveyModel.create({ title: data.title });
  }

  async updateSurvey(surveyId: string, { data }: UpdateSurveyDto) {
    return await this.surveyModel
      .findByIdAndUpdate(
        { _id: surveyId },
        {
          $set: {
            title: data.title,
            public: data.public,
          },
        },
      )
      .exec();
  }

  async removeSurvey(surveyId: string) {
    return await this.surveyModel.deleteOne({ _id: surveyId }).exec();
  }
}
