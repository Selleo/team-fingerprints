import { Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { Team } from 'src/company/entities/team.entity';
import { TeamService } from 'src/company/team/team.service';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';

export interface UserProfileI {
  readonly role: Role;
  readonly canCreateTeam: boolean;
  readonly company: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
  readonly team: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
  ) {}

  async getUserProfile(userId: string): Promise<UserProfileI> {
    const user = await this.usersService.getUser(userId);
    const company = await this.companyService.getCompanyByUserEmail(user.email);
    const team: Team = await this.teamService.getTeamByUserEmail(user.email);

    const profile: UserProfileI = {
      role: user.role,
      canCreateTeam: !company && !team && user.role === Role.USER,
      company: {
        _id: company?._id,
        name: company?.name,
        description: company?.description,
      },
      team: {
        _id: team?._id,
        name: team?.name,
        description: team?.description,
      },
    };

    return profile;
  }
}
