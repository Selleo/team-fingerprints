export type Survey = {
  title: string;
  public: boolean;
  _id: string;
};

export type Category = {
  title: string;
};

export type SurveyDetails = Survey & { categories: Category[] };
