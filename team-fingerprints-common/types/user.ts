import { Types } from "mongoose";
import { SurveyCompleteStatus } from "../enums";
import { PrivilegeI } from "./privilege";

export type QuestionAnswerI = {
  questionId: string;
  value: number;
};

export type UserI = {
  _id?: string | Types.ObjectId;
  authId: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
  surveysAnswers: UserSurveyAnswerI[];
  userDetails?: UserDetailI[];
  inCompany: boolean;
};

export type UserSurveyAnswerI = {
  surveyId: string;
  completeStatus: SurveyCompleteStatus;
  amountOfAnswers: number;
  surveyResult: [any];
  answers: QuestionAnswerI[];
};

export type UserSurveyResultI = {
  category: string;
  answers: QuestionAnswerI[];
};

export type UserDetailI = {
  [key: string]: string;
};

export type UserProfileI = {
  readonly _id: string;
  readonly email: string;
  readonly userDetails: UserDetailI[];
  readonly privileges: PrivilegeI[];
};
