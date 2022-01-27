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

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Company = {
  _id: string;
  name: string;
  description: string;
  domain: string;
};

export type Answer = {
  questionId: string;
  value: number;
};

export type SurveyResponse = {
  questionId: string;
  value: number;
};

export type SurveyDetails = Survey & { categories: Category[] };

export type role = "SUPER_ADMIN" | "COMPANY_ADMIN" | "TEAM_LEADER" | "USER";

export type Profile = { canCreateTeam: boolean; role: role };
