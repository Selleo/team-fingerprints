import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompanyMembersService } from 'src/company/company-members.service';
import { CompanyService } from 'src/company/company.service';
import { Team } from 'src/company/models/team.model';
import { TeamMembersService } from 'src/company/team/team-members.service';
import { TeamService } from 'src/company/team/team.service';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import * as request from 'request';
import { User } from 'src/users/models/user.model';
import { UserProfileI } from './interfaces/auth.interface';

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
    const user = await this.usersService.getUserByEmail(email);
    if (user.role !== Role.SUPER_ADMIN) {
      await this.companyMembersService.addMemberToCompanyByEmail(email);
      await this.teamMembersService.addMemberToTeamByEmail(email);
      await this.teamMembersService.checkEmailIfAssignedToBeLeader(email);
    }
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
        throw new BadRequestException();
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
    if (!user) throw new BadRequestException();

    await this.handleExistingUsers(user.email);
    return user;
  }
}
