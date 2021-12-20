import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { CreateTrendDto } from './dto/CreateTrendDto.dto';
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';

@Injectable()
export class TrendService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}
  async getTrend(trendId: string) {
    return trendId;
  }

  async createTrend(body: CreateTrendDto) {
    return body;
  }

  async updateTrend(trendId: string, body: UpdateTrendDto) {
    return { trendId, body };
  }

  async removeTrend(trendId: string) {
    return trendId;
  }
}
