export type Survey = {
  title: string;
  isPublic: boolean;
  _id: string;
};

export type Category = {
  _id: string;
  title: string;
  trends: Trend[];
};

export type Trend = {
  _id: string;
  primary: string;
  secondary: string;
  questions: Question[];
};

export type Question = {
  _id: string;
  title: string;
  primary: boolean;
};

export type ResponseItem = {
  survey: Survey;
};

export type SurveyDetails = Survey & { categories: Category[] };
