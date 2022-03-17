import { Injectable } from '@nestjs/common';
import { Survey } from './models/survey.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleType } from 'src/role/role.type';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly surveyAnswerService: SurveyAnswerService,
    private readonly roleService: RoleService,
  ) {}

  async getSurveysByRole(
    userId: string,
  ): Promise<(Survey & 'completeStatus')[] | Survey[]> {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      userId,
    });

    if (roleDocuments.some((el) => el.role === RoleType.SUPER_ADMIN)) {
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

  async getSurveyByRole(surveyId: string, userId: string): Promise<Survey> {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      userId,
    });

    if (roleDocuments.some((el) => el.role === RoleType.SUPER_ADMIN)) {
      return await this.getSurvey(surveyId);
    }
    return await this.surveyModel
      .findOne({ _id: surveyId, isPublic: true })
      .exec();
  }

  async getSurvey(surveyId: string): Promise<Survey> {
    return await this.surveyModel.findById(surveyId).exec();
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
