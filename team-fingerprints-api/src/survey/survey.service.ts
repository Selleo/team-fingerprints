import { Injectable } from '@nestjs/common';
import { Survey } from './entities/survey.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSurveyDto } from './dto/CreateSurveyDto.dto';
import { UpdateSurveyDto } from './dto/UpdateSurveyDto.dto';
import { UserRole } from 'src/users/user.type';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async getSurveysByRole(role: UserRole): Promise<Survey[]> {
    if (role === UserRole.ADMIN || role === UserRole.COMPANY_ADMIN) {
      return await this.surveyModel.find({}).exec();
    }
    return await this.surveyModel.find({ isPublic: true }).exec();
  }

  async getSurvey(
    surveyId: string,
    role: UserRole = UserRole.USER,
  ): Promise<Survey> {
    if (role === UserRole.ADMIN || role === UserRole.COMPANY_ADMIN) {
      return await this.surveyModel.findById({ _id: surveyId }).exec();
    }
    return await this.surveyModel
      .findById({ _id: surveyId, isPublic: true })
      .exec();
  }

  async createSurvey({ title }: CreateSurveyDto): Promise<Survey> {
    return await this.surveyModel.create({ title });
  }

  async updateSurvey(
    surveyId: string,
    { title, isPublic }: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyModel
      .findByIdAndUpdate(
        { _id: surveyId },
        {
          $set: {
            title,
            isPublic,
          },
        },
        { new: true },
      )
      .exec();
  }

  async removeSurvey(surveyId: string): Promise<Survey> {
    return await this.surveyModel
      .findOneAndDelete({ _id: surveyId }, { new: true })
      .exec();
  }
}
