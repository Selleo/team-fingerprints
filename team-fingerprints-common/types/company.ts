import { FilterTemplate } from "./filter";

export type Company = {
  _id?: string;
  name: string;
  description?: string;
  pointColor: string;
  pointShape: string;
  teams: Team[];
  domain: string;
  filterTemplates: FilterTemplate[];
  createdAt?: string;
};

export type Team = {
  _id?: string;
  name: string;
  description?: string;
  pointShape: string;
  pointColor: string;
  filterTemplates: FilterTemplate[];
  createdAt?: string;
};
