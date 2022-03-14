import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as request from 'request';
import { User } from 'src/users/models/user.model';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/role.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
  ) {}

  async handleExistingUsers(email: string) {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email,
    });

    const user = await this.usersService.getUserByEmail(email);

    roleDocuments.forEach(async (doc) => {
      console.log(doc);
      if (doc.companyId) {
        const res = await this.roleService.updateRoleDocument(
          { email: doc.email, companyId: doc.companyId },
          { userId: user._id },
        );
      }
      if (doc.companyId && doc.teamId) {
        await this.roleService.updateRoleDocument(
          { email: doc.email, companyId: doc.companyId, teamId: doc.teamId },
          { userId: user._id },
        );
      }
      if (doc.role === RoleType.TEAM_LEADER) {
        await this.roleService.updateRoleDocument(
          {
            email: doc.email,
            companyId: doc.companyId,
            teamId: doc.teamId,
            role: doc.role,
          },
          {
            userId: user._id,
          },
        );
      }
    });
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
        throw new BadRequestException(
          'Can not register user in teamfingerprints.selleo.com',
        );
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
      await this.roleService.createRoleDocument(user, { userId: user._id });
    });
    if (!user) throw new BadRequestException();

    await this.handleExistingUsers(user.email);
    return user;
  }
}
