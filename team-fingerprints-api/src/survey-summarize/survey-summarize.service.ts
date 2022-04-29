import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryModel } from 'src/survey/models/category.model';
import { SurveyModel } from 'src/survey/models/survey.model';
import { UserModel } from 'src/users/models/user.model';

@Injectable()
export class SurveySummarizeService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(SurveyModel.name)
    private readonly surveyModel: Model<SurveyModel>,
  ) {}

  async countPointsForUser(userId: string, surveyId: string) {
    const { surveysAnswers } = await this.userModel.findOne({
      _id: userId,
      'surveysAnswers.surveyId': surveyId,
    });

    const { answers, amountOfAnswers } = surveysAnswers.find(
      (el) => el.surveyId === surveyId,
    );

    const survey = await this.surveyModel.findById(surveyId);
    if (!survey)
      throw new NotFoundException(`Survey id: ${surveyId} does not exist`);

    const categories = survey.categories;

    let questions = null;
    categories.forEach((category) => {
      category.trends.forEach((trend) => {
        questions = trend.questions.map((question: any) => question);
      });
    });

    if (
      answers.length !== questions.length ||
      amountOfAnswers !== survey.amountOfQuestions
    ) {
      throw new InternalServerErrorException('Something went wrong');
    }

    const summary = [];

    categories.forEach((category: CategoryModel) => {
      const avgTrends = [];
      category.trends.forEach((trend) => {
        let trendCount = 0;
        trend.questions.forEach((question) => {
          answers.forEach((answer) => {
            if (answer.questionId.toString() === question._id.toString()) {
              if (question.primary) {
                trendCount += answer.value;
              } else {
                const count = 6 - answer.value;
                trendCount += count;
              }
            }
          });
        });

        const avgTrendAnswer = trendCount / trend.questions.length;
        if (avgTrendAnswer) {
          avgTrends.push({
            trendId: trend._id.toString(),
            trendPrimary: trend.primary,
            trendSecondary: trend.secondary,
            avgTrendAnswer,
          });
        }
      });

      const categoryId = category._id.toString();
      if (summary[categoryId]) {
        summary[categoryId] = {
          categoryTitle: category.title,
          categoryId: categoryId,
          avgTrends: [...avgTrends, ...summary[categoryId].avgTrends],
        };
      } else {
        summary[categoryId] = {
          categoryTitle: category.title,
          categoryId: categoryId,
          avgTrends,
        };
      }
    });

    return Object.values(summary);
  }
}
