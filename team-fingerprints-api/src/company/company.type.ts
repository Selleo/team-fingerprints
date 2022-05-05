import { Role } from 'team-fingerprints-common';
import { CompanyModel } from './models/company.model';

export type CompanyAndRoles =
  | { company: CompanyModel }
  | { company: CompanyModel; roles: Role[] };
