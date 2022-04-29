import { RoleType } from 'team-fingerprints-common';

export interface RoleI {
  _id?: string;
  email: string;
  userId: string;
  companyId: string;
  teamId: string;
  role: RoleType;
}
