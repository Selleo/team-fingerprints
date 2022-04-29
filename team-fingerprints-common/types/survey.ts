export type Question = {
  title: string;
  primary: boolean;
};

export type Trend = {
  primary: string;
  secondary: string;
  questions?: Question[];
};

export type Category = {
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
