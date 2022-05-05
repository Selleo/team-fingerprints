import { Types } from "mongoose";
import { SurveyCompleteStatus } from "../enums";
import { Privilege } from "./privilege";

export type QuestionAnswer = {
  questionId: string;
  value: number;
};

export type User = {
  _id?: string;
  authId: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
  inCompany: boolean;
  surveysAnswers: UserSurveyAnswer[];
  userDetails?: UserDetail[];
  createdAt?: string;
};

export type UserSurveyAnswer = {
  surveyId: string;
  completeStatus: SurveyCompleteStatus;
  amountOfAnswers: number;
  surveyResult: UserFinishedSurveyResult[];
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

export type AvgTrend = {
  trendId: string;
  trendPrimary: string;
  trendSecondary: string;
  avgTrendAnswer: number;
};

export type UserFinishedSurveyResult = {
  categoryTitle: string;
  categoryId: string;
  avgTrends: AvgTrend[];
};

export type UserWhoFinishedSurvey = {
  _id: Types.ObjectId;
  email: string;
  surveysAnswers: {
    surveyResult: UserFinishedSurveyResult[];
  };
  userDetails: UserDetail[];
};

export type DetailQuery = { [key: string]: string };
