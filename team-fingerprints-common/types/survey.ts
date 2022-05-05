import { Types } from "mongoose";

export type Question = {
  _id?: string | Types.ObjectId;
  title: string;
  primary: boolean;
};

export type Trend = {
  _id?: string | Types.ObjectId;
  primary: string;
  secondary: string;
  questions?: Question[];
};

export type Category = {
  _id?: string | Types.ObjectId;
  title: string;
  trends?: Trend[];
};

export type Survey = {
  title: string;
  categories?: Category[];
  isPublic: boolean;
  amountOfQuestions: number;
  archived: boolean;
};

type AdditionalMongoParams = {
  createdAt: string;
  _id: string;
};

export type FullSurvey = Survey & AdditionalMongoParams;
