import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}
  async getQuestion(questionId: string): Promise<string> {
    return questionId;
  }

  async createQuestion(body: CreateQuestionDto) {
    return body;
  }

  async updateQuestion(questionId: string, body: UpdateQuestionDto) {
    return { body, questionId };
  }

  async removeQuestion(questionId: string) {
    return questionId;
  }
}
