import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TfConfigModel } from './models/tf-config.model';

const SURVEY_RESULTS = 'survey-results';
const GLOBAL_FILTERS = 'global-filters';

@Injectable()
export class TfConfigService {
  constructor(
    @InjectModel(TfConfigModel.name)
    private readonly tfConfigModel: Model<TfConfigModel>,
  ) {}

  async getEmailBlackList(): Promise<string[]> {
    const document = await this.tfConfigModel
      .findOne({ name: 'emailBlacklist' })
      .exec();
    return document?.data ?? [];
  }

  // Storing global survey results

  async getGlobalSurveysResults(surveyId: string) {
    return await this.tfConfigModel
      .findOne({ name: SURVEY_RESULTS, surveyId })
      .exec();
  }

  async createGlobalSurveysResults(surveyId: string, result: unknown = {}) {
    return await (
      await this.tfConfigModel.create({
        name: SURVEY_RESULTS,
        surveyId,
        data: result,
      })
    ).save();
  }

  async updateGlobalSurveysResults(surveyId: string, newResults: unknown) {
    return await this.tfConfigModel
      .findOneAndUpdate(
        { name: SURVEY_RESULTS, surveyId },
        { data: newResults },
        { new: true },
      )
      .exec();
  }

  // Storing available global filters

  async getGlobalAvailableFilters(surveyId: string) {
    return await this.tfConfigModel
      .findOne({ name: GLOBAL_FILTERS, surveyId })
      .exec();
  }

  async createGlobalAvailableFilters(surveyId: string, filters: unknown = {}) {
    return await (
      await this.tfConfigModel.create({
        name: GLOBAL_FILTERS,
        surveyId,
        data: filters,
      })
    ).save();
  }

  async updateGlobalAvailableFilters(
    surveyId: string,
    newFilters: unknown = {},
  ) {
    return await this.tfConfigModel
      .findOneAndUpdate(
        { name: GLOBAL_FILTERS, surveyId },
        { data: newFilters },
        { new: true },
      )
      .exec();
  }
}
