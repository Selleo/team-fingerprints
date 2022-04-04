import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Survey } from './models/survey.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleType } from 'src/role/role.type';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { RoleService } from 'src/role/role.service';
import * as mongoose from 'mongoose';
import { Category } from './models/category.model';
import { Question } from './models/question.model';
import { Trend } from './models/trend.model';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @Inject(forwardRef(() => SurveyAnswerService))
    private readonly surveyAnswerService: SurveyAnswerService,
    private readonly roleService: RoleService,
  ) {}

  async getSurveysByRole(
    userId: string,
  ): Promise<(Survey & 'completeStatus')[]> {
    const surveys = await this.surveyModel.find().exec();

    const surveysWithCompleteStatus: any = surveys.map(async (survey: any) => {
      const completeStatus =
        await this.surveyAnswerService.getSurveyCompleteStatus(
          userId,
          survey._id,
        );
      return { completeStatus, ...survey._doc };
    });

    return await Promise.all(surveysWithCompleteStatus);
  }

  async getSurveys() {
    return await this.surveyModel.find({ isPublic: true, archived: false });
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
    return await (await this.surveyModel.create({ title })).save();
  }

  async duplicateSurvey(surveyId: string, { title }: CreateSurveyDto) {
    const existingSurvey = await this.getSurvey(surveyId);

    const categories = existingSurvey.categories.map((category: Category) => ({
      title: category.title,
      _id: new mongoose.Types.ObjectId(),
      trends: category.trends.map((trend: Trend) => ({
        primary: trend.primary,
        secondary: trend.secondary,
        _id: new mongoose.Types.ObjectId(),
        questions: trend.questions.map((question: Question) => ({
          primary: question.primary,
          title: question.title,
          _id: new mongoose.Types.ObjectId(),
        })),
      })),
    }));

    const newSurvey = await this.surveyModel.create({
      title,
      categories,
      amountOfQuestions: existingSurvey.amountOfQuestions,
    });

    return await newSurvey.save();
  }

  async updateSurvey(
    surveyId: string,
    { title, isPublic, archived }: UpdateSurveyDto,
  ): Promise<Survey> {
    const surveyBeforeUpdate = await this.getSurvey(surveyId);

    let updateOptions = {};

    if (surveyBeforeUpdate.isPublic) {
      updateOptions = { title, archived };
    } else {
      updateOptions = { title, archived, isPublic };
    }

    return await this.surveyModel
      .findByIdAndUpdate(
        surveyId,
        {
          $set: updateOptions,
        },
        { new: true },
      )
      .exec();
  }

  async removeSurvey(surveyId: string): Promise<Survey> {
    await this.canEditSurvey(surveyId);

    return await this.surveyModel
      .findOneAndDelete({ _id: surveyId }, { new: true })
      .exec();
  }

  async canEditSurvey(surveyId: string) {
    const surveyExists = await this.getSurvey(surveyId);
    if (!surveyExists) throw new NotFoundException();

    if (surveyExists.isPublic)
      throw new BadRequestException('Can not edit public survey.');
  }
}
