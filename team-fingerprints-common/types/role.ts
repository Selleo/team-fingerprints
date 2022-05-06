import { RoleType } from "../enums";

export type Role = {
  _id?: string;
  email: string;
  userId?: string;
  companyId?: string;
  teamId?: string;
  role: RoleType;
  createdAt?: string;
};
