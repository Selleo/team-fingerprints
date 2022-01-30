export interface QuestionI {
  title: string;
  primary: boolean;
}

export interface TrendI {
  primary: string;
  secondary: string;
  questions?: QuestionI[];
}

export interface CategoryI {
  title: string;
  trends?: TrendI[];
}

export interface SurveyI {
  title: string;
  categories?: CategoryI[];
  isPublic: boolean;
  amountOfQuestions: number;
  archived: boolean;
}
