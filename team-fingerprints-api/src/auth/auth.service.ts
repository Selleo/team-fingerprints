import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompanyMembersService } from 'src/company/company-members.service';
import { CompanyService } from 'src/company/company.service';
import { Team } from 'src/company/entities/team.entity';
import { TeamMembersService } from 'src/company/team/team-members.service';
import { TeamService } from 'src/company/team/team.service';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import * as request from 'request';
import { User } from 'src/users/entities/user.entity';

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
    private readonly companyMembersService: CompanyMembersService,
    private readonly teamService: TeamService,
    private readonly teamMembersService: TeamMembersService,
    private readonly configService: ConfigService,
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

  async handleExistingUsers(email: string) {
    await this.companyMembersService.addMemberToCompanyByEmail(email);
    await this.teamMembersService.addMemberToTeamByEmail(email);
  }

  async handleNewUsers(auth0Id: string) {
    const options = (id: string) => ({
      method: 'GET',
      url: `https://dev-llkte41m.us.auth0.com/api/v2/users/${id}`,
      headers: {
        authorization: `Bearer ${this.configService.get<string>(
          'AUTH0_MANAGEMENT_API_TOKEN',
        )}`,
      },
    });

    let user: User;
    await request(options(auth0Id), async (err, res, body) => {
      if (err) {
        return new BadRequestException();
      }
      const {
        email,
        family_name: firstName,
        given_name: lastName,
        picture,
        pictureUrl,
      } = JSON.parse(body);
      user = await this.usersService.createUser({
        authId: auth0Id,
        email,
        pictureUrl: pictureUrl || picture || undefined,
        firstName,
        lastName,
      });
    });
    if (!user) return new BadRequestException();

    await this.handleExistingUsers(user.email);
    return user;
  }
}
