import { DetailQuery } from "./user";

export type FilterTemplate = {
  _id: string;
  name: string;
  surveyId: string;
  pointColor: string;
  pointShape: string;
  visible: boolean;
  filters: DetailQuery;
};

export type FilterTemplateResponse = { [key: string]: FilterTemplate };
