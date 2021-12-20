import { Injectable } from '@nestjs/common';
import { Survey } from 'src/entities/survey.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async getSurvey(surveyId: string) {
    return surveyId;
  }

  async removeSurvey(surveyId: string) {
    return surveyId;
  }
}
