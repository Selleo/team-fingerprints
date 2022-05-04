import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyModel } from 'src/survey/models/survey.model';
import { SurveyService } from 'src/survey/survey.service';
import {
  CreateTrendDto,
  TrendParamsDto,
  UpdateTrendDto,
} from './dto/trend.dto';
import { QuestionService } from './question/question.service';

@Injectable()
export class TrendService {
  constructor(
    @InjectModel(SurveyModel.name)
    private readonly surveyModel: Model<SurveyModel>,
    private readonly questionService: QuestionService,
    @Inject(forwardRef(() => SurveyService))
    private readonly surveyService: SurveyService,
  ) {}

  async createTrend(
    { surveyId, categoryId }: TrendParamsDto,
    { primary, secondary }: CreateTrendDto,
  ): Promise<SurveyModel> {
    await this.surveyService.canEditSurvey(surveyId);

    return await this.surveyModel.findOneAndUpdate(
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $push: {
          'categories.$.trends': {
            primary,
            secondary,
          },
        },
      },
      { new: true },
    );
  }

  async updateTrend(
    { surveyId, categoryId, trendId }: TrendParamsDto,
    { primary, secondary }: UpdateTrendDto,
  ): Promise<SurveyModel> {
    return await this.surveyModel.findOneAndUpdate(
      {
        _id: surveyId,
      },
      {
        $set: {
          'categories.$[category].trends.$[trend].primary': primary,
          'categories.$[category].trends.$[trend].secondary': secondary,
        },
      },
      {
        arrayFilters: [
          {
            'trend._id': trendId,
          },
          { 'category._id': categoryId },
        ],
        new: true,
      },
    );
  }

  async removeTrend({ surveyId, categoryId, trendId }: TrendParamsDto) {
    await this.surveyService.canEditSurvey(surveyId);

    const { categories } = await this.surveyModel.findOne(
      {
        _id: surveyId,
      },
      { categories: true },
    );

    if (!categories) throw new NotFoundException();

    const questionsId = [];
    categories.forEach((category) => {
      if (category?._id.toString() === categoryId) {
        category.trends.forEach((trend) => {
          if (trend?._id.toString() === trendId) {
            trend.questions.forEach((question) => {
              questionsId.push(question?._id.toString());
            });
          }
        });
      }
    });
    if (questionsId) {
      await this.questionService.removeQuestions(surveyId, questionsId);
    }

    return await this.surveyModel.findOneAndUpdate(
      {
        'categories.trends._id': trendId,
      },
      {
        $pull: {
          'categories.$[].trends': { _id: trendId },
        },
      },
      { new: true },
    );
  }
}
