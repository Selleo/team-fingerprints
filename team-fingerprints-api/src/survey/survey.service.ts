import { Injectable } from '@nestjs/common';
import { Survey } from './models/survey.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleType } from 'src/role/role.type';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly surveyAnswerService: SurveyAnswerService,
  ) {}

  async getSurveysByRole(
    role: RoleType,
    userId: string,
  ): Promise<(Survey & 'completeStatus')[] | Survey[]> {
    if (role === RoleType.SUPER_ADMIN) {
      return await this.surveyModel.find({}).exec();
    }

    const surveys = await this.surveyModel.find({ isPublic: true }).exec();

    const surveysWithCompleteStatus: any = surveys.map(async (survey: any) => {
      const completeStatus =
        await this.surveyAnswerService.getSurveyCompleteStatus(
          userId,
          survey._id,
        );
      return Object.assign({ completeStatus, ...survey._doc });
    });

    return await Promise.all(surveysWithCompleteStatus);
  }

  async getSurvey(
    surveyId: string,
    role: RoleType = RoleType.USER,
  ): Promise<Survey> {
    if (role === RoleType.SUPER_ADMIN) {
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
    { title, isPublic, archived }: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyModel
      .findByIdAndUpdate(
        { _id: surveyId },
        {
          $set: {
            title,
            isPublic,
            archived,
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
