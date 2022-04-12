import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class SurveySummarizeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async countPointsForUser(userId: string, surveyId: string) {
    const userAnswersAll = await this.userModel.findOne({
      _id: userId,
      'surveysAnswers.surveyId': surveyId,
    });

    const userAnswers = userAnswersAll.surveysAnswers.find(
      (el) => el.surveyId === surveyId,
    );

    const { answers } = userAnswers;

    const survey = await this.surveyModel.findById({ _id: surveyId });
    if (!survey) throw new InternalServerErrorException();
    const categories = survey.categories;

    const questions = [];
    categories.forEach((category) => {
      category.trends.forEach((trend) => {
        trend.questions.forEach((question: any) => {
          questions.push(question);
        });
      });
    });

    if (
      answers.length !== questions.length ||
      userAnswers.amountOfAnswers !== survey.amountOfQuestions
    ) {
      throw new InternalServerErrorException();
    }

    const summary = [];

    categories.forEach((category: any) => {
      const avgTrends = [];
      category.trends.forEach((trend: any) => {
        let trendCount = 0;
        trend.questions.forEach((question: any) => {
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
