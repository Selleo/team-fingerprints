import { Types } from "mongoose";
import { SurveyCompleteStatus } from "../enums";
import { Privilege } from "./privilege";

export type QuestionAnswer = {
  questionId: string;
  value: number;
};

export type User = {
  _id?: string | Types.ObjectId;
  authId: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
  surveysAnswers: UserSurveyAnswer[];
  userDetails?: UserDetail[];
  inCompany: boolean;
  createdAt?: string;
};

export type UserSurveyAnswer = {
  surveyId: string;
  completeStatus: SurveyCompleteStatus;
  amountOfAnswers: number;
  surveyResult: [any];
  answers: QuestionAnswer[];
};

export type UserSurveyResult = {
  category: string;
  answers: QuestionAnswer[];
};

export type UserDetail = {
  [key: string]: string;
};

export type UserProfile = {
  readonly _id: string;
  readonly email: string;
  readonly userDetails: UserDetail[];
  readonly privileges: Privilege[];
};
