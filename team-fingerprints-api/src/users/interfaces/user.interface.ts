import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';

export interface QuestionAnswerI {
  questionId: string;
  value: number;
}

export interface UserI {
  _id?: string;
  authId: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
  surveysAnswers: UserSurveyAnswerI[];
  userDetails?: UserDetailsI;
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

export interface UserDetailsI {
  country: string;
  companyType: string;
  mainTechnology: string;
  techLevel: string;
  developerType: string;
}
