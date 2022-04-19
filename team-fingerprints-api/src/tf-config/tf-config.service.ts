import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TfConfig } from './models/tf-config.model';

@Injectable()
export class TfConfigService {
  constructor(
    @InjectModel(TfConfig.name) private readonly tfConfigModel: Model<TfConfig>,
  ) {}

  async getEmailBlackList() {
    const document = await this.tfConfigModel
      .findOne({ name: 'emailBlacklist' })
      .exec();
    return document?.data ?? [];
  }

  async getGlobalSurveysResults(surveyId: string) {
    return await this.tfConfigModel.findOne({ name: surveyId }).exec();
  }

  async createGlobalSurveysResults(surveyId: string, result: unknown = {}) {
    return await (
      await this.tfConfigModel.create({ name: surveyId, data: result })
    ).save();
  }

  async updateGlobalSurveysResults(surveyId: string, newResults: unknown) {
    return await this.tfConfigModel
      .findOneAndUpdate({ name: surveyId }, { data: newResults }, { new: true })
      .exec();
  }
}
