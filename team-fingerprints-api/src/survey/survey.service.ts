import { Injectable } from '@nestjs/common';
import { Survey } from 'src/entities/survey.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSurveyDto } from './dto/CreateSurvey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  helloWorld(): string {
    return 'helloooo wooorlddd';
  }

  async createSurvey(data: CreateSurveyDto) {
    return await this.surveyModel.create(data);
  }
}
