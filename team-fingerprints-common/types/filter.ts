import { DetailQuery } from "./user";

export type FilterTemplate = {
  _id: string;
  name: string;
  pointColor: string;
  pointShape: string;
  visible: boolean;
} & DetailQuery;
