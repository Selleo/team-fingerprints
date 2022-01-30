import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyAnswerService } from 'src/survey-answer/survey-answer.service';
import { User } from 'src/users/models/user.model';

@Injectable()
export class SurveyResultService {
  constructor(
    private readonly surveyAnswerService: SurveyAnswerService,
    @InjectModel(User.name) private readonly User: Model<User>,
  ) {}

  async getSurveyResultForCurrentUser(userId: string, surveyId: string) {
    const isFinished = await this.surveyAnswerService.checkIfSurveyIsFinished(
      userId,
      surveyId,
    );
    if (!isFinished)
      return new BadRequestException('Survey is not completed yet');

    const userAnswersAll = await this.User.findOne({
      _id: userId,
      'surveysAnswers.surveyId': surveyId,
    }).exec();

    const userAnswers = userAnswersAll.surveysAnswers.find(
      (el) => el.surveyId === surveyId,
    );

    const result = userAnswers.surveyResult;
    return result;
  }

  async getAvgResultForAllCompanies(currentUserId: string, surveyId: string) {
    return { currentUserId, surveyId };
  }

  async getAvgResultForCompany(
    currentUserId: string,
    surveyId: string,
    companyId: string,
  ) {
    return { currentUserId, surveyId, companyId };
  }

  async getAvgResultForTeam(
    currentUserId: string,
    surveyId: string,
    companyId: string,
    teamId: string,
  ) {
    return { currentUserId, surveyId, companyId, teamId };
  }

  async getSurveyResultForUser(
    currentUserId: string,
    surveyId: string,
    companyId: string,
    teamId: string,
    userId: string,
  ) {
    return { currentUserId, surveyId, companyId, teamId, userId };
  }
}
