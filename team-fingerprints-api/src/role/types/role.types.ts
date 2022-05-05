import { RoleType } from 'team-fingerprints-common';

export type Role = {
  _id?: string;
  email: string;
  userId: string;
  companyId: string;
  teamId: string;
  role: RoleType;
  createdAt?: string;
};
