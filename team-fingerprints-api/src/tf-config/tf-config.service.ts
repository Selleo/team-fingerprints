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
}
