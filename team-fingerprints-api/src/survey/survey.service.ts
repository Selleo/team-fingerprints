import { Injectable } from '@nestjs/common';
import { Survey } from 'src/entities/survey.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async getSurveysAll() {
    return await this.surveyModel.find({}, { _id: 1, public: 1, title: 1 });
  }

  async getSurvey(surveyId: string) {
    return await this.surveyModel.findById({ _id: surveyId }).exec();
  }

  async createSurvey(title: string) {
    return await this.surveyModel.create({ title });
  }

  async removeSurvey(surveyId: string) {
    return await this.surveyModel.findByIdAndDelete({ _id: surveyId }).exec();
  }
}
