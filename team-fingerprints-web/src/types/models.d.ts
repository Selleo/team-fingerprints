export type Survey = {
  title: string;
  isPublic: boolean;
  _id: string;
  createdAt: string;
  completionStatus: string;
  archived: boolean;
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
  authId: string;
  companyId: string;
  createdAt: string;
  pictureUrl: string;
  role: "COMPANY_ADMIN" | "SUPER_ADMIN" | "USER" | "TEAM_LEADER";
  surveysAnswers: Answer[];
  updatedAt: string;
};

export type TeamLead = {
  _id: string;
  email: string;
};

export type Team = {
  _id: string;
  name: string;
  emailWhitelist: string[];
  description: string;
  teamLeader?: TeamLead;
  pointShape: Shape;
  pointColor: string;
};

export type Company = {
  _id: string;
  name: string;
  description: string;
  domain: string;
  emailWhitelist: string[];
  teams: Team[];
  pointShape: Shape;
  pointColor: string;
};

export type Answer = {
  questionId: string | ObjectIterator<Answer, boolean>;
  value: number;
};

export type SurveyAnswers = [
  {
    amountOfAnswers: number;
    answers: Answer;
    completionStatus: string;
    surveyId: string;
    surveyResult: CategoryResults[];
  }
];

export type SurveyDetails = Survey & { categories: Category[] };

export type role = "SUPER_ADMIN" | "COMPANY_ADMIN" | "TEAM_LEADER" | "USER";

type ComplexRole = {
  team: {
    _id: string;
    name: string;
    pointShape: Shape;
    pointColor: string;
  };
  company: {
    _id: string;
    name: string;
    pointShape: Shape;
    pointColor: string;
  };
  role: role;
  roleId: string;
};

type CompanyRole = {
  companyId: string;
  teamId: string;
  createdAt: string;
  email: string;
  role: role;
  updatedAt: string;
  userId: string;
  _id: string;
};

export type Profile = {
  privileges: ComplexRole[];
  email: string;
  _id: string;
  userDetails: { [key: string]: string | null };
};

export type QuestionWithAnswers = { answer: Answer; question: Question };

export type Shape = "triangle" | "square" | "circle" | "trapeze";

export type TrendResults = {
  avgTrendAnswer: number;
  trendId: string;
  trendPrimary: string;
  trendSecondary: string;
};

export type CategoryResults = {
  categoryId: string;
  categoryTitle: string;
  avgTrends: TrendResults[];
};

export type AdditionalData = {
  name: string;
  pointColor: string;
  pointShape: Shape;
  categories: CategoryResults[];
  _id: string;
};

export type FiltersSet = {
  name: string;
  pointColor: string;
  pointShape: Shape;
  categories: CategoryResults[];
  _id: string;
  visible: boolean;
  filters: { [key: string]: Array<string> };
};

export type FilterSets = { [key: string | number]: FiltersSet };

export type ChangeFilterValue = <T extends keyof FiltersSet>(
  id: string,
  valueName: T,
  newValue: FiltersSet[T]
) => void;

export type ChangeFilterDataValue = <T extends keyof FiltersSet>(
  valueName: T,
  newValue: FiltersSet[T]
) => void;

export type Filter = {
  _id: string;
  filterPath: string;
  name: string;
  values: FilterValue[];
};

export type FilterValue = {
  _id: string;
  value: string;
};

export type FormData = {
  [key: string]: string;
};

export type ProfileSelectorProp = {
  item: Filter;
  setFieldValue: (field: string, value: string) => void;
  handleSubmit: () => void;
  values: FormData;
};

export type FilterSelect = {
  name: string;
  _id: string;
  filterPath: string;
  values: [{ value: string; _id: string; label: string }];
};

type CompanyResponse = {
  company: Company;
  roles: CompanyRole[];
};

type TeamResponse = {
  team: Team;
  roles: CompanyRole[];
};
