import { Types } from 'mongoose';
import { PrivilegeI } from 'src/auth/interfaces/auth.interface';
import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';

export interface QuestionAnswerI {
  questionId: string;
  value: number;
}

export interface UserI {
  _id?: string | Types.ObjectId;
  authId: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
  surveysAnswers: UserSurveyAnswerI[];
  userDetails?: UserDetailI[];
  inCompany: boolean;
}

export interface UserSurveyAnswerI {
  surveyId: string;
  completeStatus: SurveyCompleteStatus;
  amountOfAnswers: number;
  surveyResult: [any];
  answers: QuestionAnswerI[];
}

export interface UserSurveyResultI {
  category: string;
  answers: QuestionAnswerI[];
}

export interface UserDetailI {
  [key: string]: string;
}

export interface UserProfileI {
  readonly _id: string;
  readonly email: string;
  readonly userDetails: UserDetailI[];
  readonly privileges: PrivilegeI[];
}
