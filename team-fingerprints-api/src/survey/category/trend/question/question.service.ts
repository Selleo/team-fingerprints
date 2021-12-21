import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { QuestionParamsDto } from './dto/QuestionParamsDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async createQuestion(params: QuestionParamsDto, body: CreateQuestionDto) {
    return { params, body };
  }

  async updateQuestion(
    { questionId }: QuestionParamsDto,
    body: UpdateQuestionDto,
  ) {
    return { questionId, body };
  }

  async removeQuestion({ questionId }: QuestionParamsDto) {
    return questionId;
  }
}
