import { Injectable } from '@nestjs/common';
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

  async countPoints(userId: string, surveyId: string) {
    const userAnswers = await this.userModel
      .findOne(
        { _id: userId, 'surveysAnswers.surveyId': surveyId },
        { surveysAnswers: 1 },
      )
      .exec();
    const [surveysAnswers] = userAnswers.surveysAnswers;
    const { responses } = surveysAnswers;

    const survey = await this.surveyModel.findById({ _id: surveyId });
    const categories = survey.categories;

    const questions = [];
    categories.forEach((category) => {
      category.trends.forEach((trend) => {
        trend.questions.forEach((question: any) => {
          questions.push(question._id.toString());
        });
      });
    });

    return { questions, responses };
  }
}
