import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SurveyResultService {
  constructor(
    private readonly surveyAnswerService: SurveyAnswerService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getSurveyResult(userId: string, surveyId: string) {
    const isFinished = await this.surveyAnswerService.checkIfSurveyIsFinished(
      userId,
      surveyId,
    );
    if (!isFinished)
      return new BadRequestException('Survey is not completed yet');

    const userAnswersAll = await this.userModel
      .findOne({ _id: userId, 'surveysAnswers.surveyId': surveyId })
      .exec();

    const userAnswers = userAnswersAll.surveysAnswers.find(
      (el) => el.surveyId === surveyId,
    );

    const result = userAnswers.surveyResult;
    return result;
  }
}
