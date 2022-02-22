import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompanyMembersService } from 'src/company/company-members.service';
import { TeamMembersService } from 'src/company/team/team-members.service';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import * as request from 'request';
import { User } from 'src/users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companyMembersService: CompanyMembersService,
    private readonly teamMembersService: TeamMembersService,
    private readonly configService: ConfigService,
  ) {}

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
      user = await this.usersService.getUserByEmail(email);
      if (user) return await this.handleExistingUsers(email);
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
