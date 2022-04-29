export type QuestionI = {
  title: string;
  primary: boolean;
};

export type TrendI = {
  primary: string;
  secondary: string;
  questions?: QuestionI[];
};

export type CategoryI = {
  title: string;
  trends?: TrendI[];
};

export type SurveyI = {
  title: string;
  categories?: CategoryI[];
  isPublic: boolean;
  amountOfQuestions: number;
  archived: boolean;
};

type AdditionalMongoParams = {
  createdAt: string;
  _id: string;
};

export type FullSurveyI = SurveyI & AdditionalMongoParams;
