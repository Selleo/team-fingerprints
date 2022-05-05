import { Role } from 'team-fingerprints-common';
import { TeamModel } from '../models/team.model';

export type TeamAndRoles =
  | { team: TeamModel }
  | { team: TeamModel; roles: Role[] };
