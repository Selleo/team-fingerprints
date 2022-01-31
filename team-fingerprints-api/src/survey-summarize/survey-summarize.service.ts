import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/survey/entities/survey.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SurveySummarizeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async countPointsForUser(userId: string, surveyId: string) {
    const userAnswersAll = await this.userModel
      .findOne({ _id: userId, 'surveysAnswers.surveyId': surveyId })
      .exec();

    const userAnswers = userAnswersAll.surveysAnswers.find(
      (el) => el.surveyId === surveyId,
    );

    const { answers } = userAnswers;

    const survey = await this.surveyModel.findById({ _id: surveyId });
    if (!survey) return new InternalServerErrorException();
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
      summary.push({
        categoryId: category._id.toString(),
        categoryTitle: category.title,
        avgTrends,
      });
    });

    return summary;
  }
}
